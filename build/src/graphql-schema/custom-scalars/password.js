"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const graphql_1 = require("graphql");
const errorMessages_1 = require("./errorMessages");
const typeDefs = apollo_server_express_1.gql `
    scalar Password
`;
const resolvers = {
    Password: new graphql_1.GraphQLScalarType({
        name: 'Password',
        description: 'Password custom scalar type with validation',
        serialize(value) {
            return parsePassword(value);
        },
        parseValue(value) {
            return parsePassword(value);
        },
        parseLiteral(ast) {
            if (ast.kind === graphql_1.Kind.STRING) {
                return parsePassword(ast.value);
            }
            else {
                throw new apollo_server_express_1.ApolloError(errorMessages_1.INVALID_PASSWORD);
            }
        }
    })
};
const parsePassword = (value) => {
    if (!value || !(typeof value === 'string') || value.length < 8 || value.length > 30) {
        throw new apollo_server_express_1.ApolloError(errorMessages_1.INVALID_PASSWORD);
    }
    return value;
};
exports.default = {
    typeDefs,
    resolvers
};
