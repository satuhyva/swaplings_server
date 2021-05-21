import { gql } from 'apollo-server-express'
import { Model } from 'mongoose'
import { IPerson } from '../../../mongoose-schema/person'
import { SignUpPersonInputType } from '../../../types/person/SignUpPersonInputType'
import { signUpPersonService } from '../services/signUpPersonService'
import { LoginSignUpResponseType } from '../../../types/person/LoginSignUpResponseType'
import { LoginPersonInputType } from '../../../types/person/LoginPersonInputType'
import { loginPersonService } from '../services/loginPersonService'
import { loginPersonWithFacebookService } from '../services/loginPersonWithFacebookService'
import { FacebookInputType } from '../../../types/person/FacebookInputType'
import { RemovePersonType } from '../../../types/person/RemovePersonType'
import { removePersonService } from '../services/removePersonService'
import { IItem } from '../../../mongoose-schema/item'
import { ItemDatabaseType } from '../../../types/item/ItemDatabaseType'
import { PersonDatabaseType } from '../../../types/person/PersonDatabaseType'
import { ownedItemsService } from '../services/ownedItemsService'


const typeDefs = gql`

    input SignUpInput {
        username: Username!
        password: Password! 
        email: Email 
    }

    input LoginInput {
        username: Username!
        password: Password! 
    }

    input FacebookLoginInput {
        userId: String!
        facebookAccessToken: String!
    }

    type LoginSignUpResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        id: ID
        username: String
        facebookName: String
        jwtToken: String
    }

    type RemovePersonResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        id: ID
        username: String
        facebookName: String
    }

    type Person {
        id: ID!
        username: String
        email: String
        facebookId: String
        facebookName: String
        ownedItems: [Item]
    }

    # type PrivatePerson {
    #     id: ID!
    #     username: String
    #     facebookName: String
    #     email: String
    #     # ownedItems: [PrivateItem]!
    # }

    # extend type Query {
    #     allPersonsInDatabase: [PrivatePerson]!
    #     privatePersonById(id: String!): PrivatePerson
    # }

    extend type Mutation {
        signUpPerson(signUpInput: SignUpInput!): LoginSignUpResponse!
        loginPerson(loginInput: LoginInput!): LoginSignUpResponse!
        facebookLogin(facebookLoginInput: FacebookLoginInput!): LoginSignUpResponse!
        removePerson: RemovePersonResponse
    }

`

const resolvers = {

    // Query: {

    //     allPersonsInDatabase: async (_root: void, _args: void, context: { Person: Model<IPerson> }): Promise<PersonDatabaseType[]> => {
    //         const allPersons = await allPersonsInDatabaseService(context.Person)
    //         return allPersons
    //     },

    //     privatePersonById: async (_root: void, args: { id: string }, context: { Person: Model<IPerson> }): Promise<Omit<PersonDatabaseType, 'passwordHash'> | null> => {
    //         const person = await privatePersonByUsernameService(context.Person, args.id)
    //         return person
    //     },

    // },

    Mutation: {

        signUpPerson: async (_: void, args: { signUpInput: SignUpPersonInputType }, context: { Person: Model<IPerson> }): 
            Promise<LoginSignUpResponseType> => {
                const signedUpPerson = await signUpPersonService(context.Person, args.signUpInput)
                return signedUpPerson
        },

        loginPerson: async (_: void, args: { loginInput: LoginPersonInputType }, context: { Person: Model<IPerson> }):
            Promise<LoginSignUpResponseType> => {
                const loggedInPerson = await loginPersonService(args.loginInput, context.Person)
                return loggedInPerson
        },

        facebookLogin: async (_: void, args: { facebookLoginInput: FacebookInputType }, context: { Person: Model<IPerson> }):
            Promise<LoginSignUpResponseType> => {
                const loggedInPerson = await loginPersonWithFacebookService(args.facebookLoginInput, context.Person)
                return loggedInPerson
        },

        removePerson: async (_root: void, _args: void, context: { authenticatedPerson: IPerson, Person: Model<IPerson> }): Promise<RemovePersonType> => {
            const removePersonResult = await removePersonService(context.authenticatedPerson, context.Person)
            return removePersonResult
        }


    },

    Person: {

        ownedItems: async (root: PersonDatabaseType, _args: void, context: { authenticatedPerson: IPerson, Item: Model<IItem> }): Promise<null | ItemDatabaseType[]> => {
            const items = await ownedItemsService(context.authenticatedPerson, root.id, context.Item)
            return items
        },
        
    },


}

export default {
    typeDefs,
    resolvers
}