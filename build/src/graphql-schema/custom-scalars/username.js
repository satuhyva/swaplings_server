"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const graphql_1 = require("graphql");
const errorMessages_1 = require("./errorMessages");
const typeDefs = apollo_server_express_1.gql `
    scalar Username
`;
const resolvers = {
    Username: new graphql_1.GraphQLScalarType({
        name: 'Username',
        description: 'Username custom scalar type with validation',
        serialize(value) {
            return parseUsername(value);
        },
        parseValue(value) {
            return parseUsername(value);
        },
        parseLiteral(ast) {
            if (ast.kind === graphql_1.Kind.STRING) {
                return parseUsername(ast.value);
            }
            else {
                throw new apollo_server_express_1.ApolloError(errorMessages_1.INVALID_USERNAME);
            }
        }
    })
};
const parseUsername = (value) => {
    if (!value || !(typeof value === 'string') || value.length < 3 || value.length > 25) {
        throw new apollo_server_express_1.ApolloError(errorMessages_1.INVALID_USERNAME);
    }
    return value;
};
exports.default = {
    typeDefs,
    resolvers
};
