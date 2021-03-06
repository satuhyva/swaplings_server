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
import { IChat } from '../../../mongoose-schema/chat'


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

    extend type Mutation {
        signUpPerson(signUpInput: SignUpInput!): LoginSignUpResponse!
        loginPerson(loginInput: LoginInput!): LoginSignUpResponse!
        facebookLogin(facebookLoginInput: FacebookLoginInput!): LoginSignUpResponse!
        removePerson: RemovePersonResponse
    }

`

const resolvers = {

    Mutation: {

        signUpPerson: async (_: void, args: { signUpInput: SignUpPersonInputType }, context: { Person: Model<IPerson> }): 
            Promise<LoginSignUpResponseType> => {
                return signUpPersonService(context.Person, args.signUpInput)
        },

        loginPerson: async (_: void, args: { loginInput: LoginPersonInputType }, context: { Person: Model<IPerson> }):
            Promise<LoginSignUpResponseType> => {
                return loginPersonService(args.loginInput, context.Person)
        },

        facebookLogin: async (_: void, args: { facebookLoginInput: FacebookInputType }, context: { Person: Model<IPerson> }):
            Promise<LoginSignUpResponseType> => {
                return loginPersonWithFacebookService(args.facebookLoginInput, context.Person)
        },

        removePerson: async (_root: void, _args: void, context: { authenticatedPerson: IPerson, Person: Model<IPerson>, Item: Model<IItem>, Chat: Model<IChat> }): Promise<RemovePersonType> => {
            return removePersonService(context.authenticatedPerson, context.Person, context.Item, context.Chat)
        }

    },

    Person: {

        ownedItems: async (root: PersonDatabaseType, _args: void, context: { authenticatedPerson: IPerson, Item: Model<IItem> }): Promise<null | ItemDatabaseType[]> => {
            return ownedItemsService(context.authenticatedPerson, root.id, context.Item)
        },
        
    },


}

export default {
    typeDefs,
    resolvers
}