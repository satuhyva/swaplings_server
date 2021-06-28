"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const signUpPersonService_1 = require("../services/signUpPersonService");
const loginPersonService_1 = require("../services/loginPersonService");
const loginPersonWithFacebookService_1 = require("../services/loginPersonWithFacebookService");
const removePersonService_1 = require("../services/removePersonService");
const ownedItemsService_1 = require("../services/ownedItemsService");
const typeDefs = apollo_server_express_1.gql `

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

`;
const resolvers = {
    Mutation: {
        signUpPerson: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return signUpPersonService_1.signUpPersonService(context.Person, args.signUpInput);
        }),
        loginPerson: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return loginPersonService_1.loginPersonService(args.loginInput, context.Person);
        }),
        facebookLogin: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return loginPersonWithFacebookService_1.loginPersonWithFacebookService(args.facebookLoginInput, context.Person);
        }),
        removePerson: (_root, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return removePersonService_1.removePersonService(context.authenticatedPerson, context.Person, context.Item, context.Chat);
        })
    },
    Person: {
        ownedItems: (root, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return ownedItemsService_1.ownedItemsService(context.authenticatedPerson, root.id, context.Item);
        }),
    },
};
exports.default = {
    typeDefs,
    resolvers
};
