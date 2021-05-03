import { gql, ApolloError } from 'apollo-server-express'
import { PersonDatabaseType } from '../../types/person/PersonDatabaseType'
import { Model } from 'mongoose'
import { IPerson } from '../../mongoose-schema/person'
import bcryptjs from 'bcryptjs'
import { IItem } from '../../mongoose-schema/item'
import { ItemDatabaseType } from '../../types/item/ItemDatabaseType'
import { getItemDatabaseType } from '../item/getItemDatabaseType'
import { getPersonDatabaseType } from './getPersonDatabaseType'



const typeDefs = gql`

    directive @personInputValidation on INPUT_FIELD_DEFINITION

    input AddNewPersonInput {
        username: String! @personInputValidation
        password: String! @personInputValidation
        email: String @personInputValidation
    }

    type PrivatePerson {
        id: ID!
        username: String!
        passwordHash: String
        email: String
        ownedItems: [PrivateItem]!
    }

    extend type Query {
        allPersonsInDatabase: [PrivatePerson]!
        privatePersonByUsername(username: String!): PrivatePerson
    }

    extend type Mutation {
        addNewPerson(personInput: AddNewPersonInput!): PrivatePerson
    }

`

const resolvers = {

    Query: {

        allPersonsInDatabase: async (_root: void, _args: void, context: { Person: Model<IPerson> }): Promise<PersonDatabaseType[]> => {
            if (process.env.NODE_ENV === 'production') {
                throw new ApolloError('The "get all persons in database"-functionality is not available in production mode.')
            }
            const { Person } = context
            const allPersons = await Person.find({})
            return allPersons.map(personInDatabase => getPersonDatabaseType(personInDatabase))
        },

        privatePersonByUsername: async (_root: void, args: { username: string }, context: { Person: Model<IPerson> }): Promise<Omit<PersonDatabaseType, 'passwordHash'>> => {
            const { Person } = context
            const person: IPerson | null = await Person.findOne({ username: args.username })
            if (!person) throw new ApolloError('Person not found!')
            return { id: person._id, username: person.username, email: person.email, ownedItemdIds: person.ownedItemIds }
        },

    },

    Mutation: {

        addNewPerson: async (_: void, args: { personInput: { username: string, password: string, email: string } }, context: { Person: Model<IPerson> }): 
            Promise<Omit<PersonDatabaseType, 'passwordHash'>> => {
            const { Person } = context
            const { username, password, email } = args.personInput
            if (email) {
                const existingPersonWithEmail = await Person.find({ email: email })
                if (existingPersonWithEmail.length > 0) {
                    throw new ApolloError('Email already in use. Duplicate emails are not allowed.')
                }
            }
            const salt = bcryptjs.genSaltSync(10)
            const passwordHash = bcryptjs.hashSync(password, salt)
            const personToAdd = new Person({ username: username, passwordHash: passwordHash, email: email })
            const savedNewPerson: IPerson = await personToAdd.save()
            return { id: savedNewPerson._id, username: savedNewPerson.username, email: savedNewPerson.email, ownedItemdIds: savedNewPerson.ownedItemIds }
        },


    },

    PrivatePerson: {

        ownedItems: async (root: PersonDatabaseType, _args: void, context: { Item: Model<IItem> }): Promise<ItemDatabaseType[]> => {
            const { Item } = context
            const itemsByPerson = await Item.find({ ownerPersonId: root.id })
            return itemsByPerson.map(item => getItemDatabaseType(item))
        },
        
    },


}

export default {
    typeDefs,
    resolvers
}