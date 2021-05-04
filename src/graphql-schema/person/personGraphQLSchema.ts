import { gql } from 'apollo-server-express'
import { PersonDatabaseType } from '../../types/person/PersonDatabaseType'
import { Model } from 'mongoose'
import { IPerson } from '../../mongoose-schema/person'
import { IItem } from '../../mongoose-schema/item'
import { ItemDatabaseType } from '../../types/item/ItemDatabaseType'
import { AddPersonInputType } from '../../types/person/AddPersonInputType'
import { addNewPersonService } from './addNewPersonService'
import { allPersonsInDatabaseService } from './allPersonsInDatabaseService'
import { privatePersonByUsernameService } from './privatePersonByUsernameService'
import { ownedItemsService } from './ownedItemsService'


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
            const allPersons = await allPersonsInDatabaseService(context.Person)
            return allPersons
        },

        privatePersonByUsername: async (_root: void, args: { username: string }, context: { Person: Model<IPerson> }): Promise<Omit<PersonDatabaseType, 'passwordHash'> | null> => {
            const person = await privatePersonByUsernameService(context.Person, args.username)
            return person
        },

    },

    Mutation: {

        addNewPerson: async (_: void, args: { personInput: AddPersonInputType }, context: { Person: Model<IPerson> }): 
            Promise<Omit<PersonDatabaseType, 'passwordHash'>> => {
                const addedNewPerson = await addNewPersonService(context.Person, args.personInput)
                return addedNewPerson
        },

    },

    PrivatePerson: {

        ownedItems: async (root: PersonDatabaseType, _args: void, context: { Item: Model<IItem> }): Promise<ItemDatabaseType[]> => {
            const items = await ownedItemsService(root.id, context.Item)
            return items
        },
        
    },


}

export default {
    typeDefs,
    resolvers
}