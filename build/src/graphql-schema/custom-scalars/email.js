"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const graphql_1 = require("graphql");
const errorMessages_1 = require("./errorMessages");
const typeDefs = apollo_server_express_1.gql `
    scalar Email
`;
const resolvers = {
    Email: new graphql_1.GraphQLScalarType({
        name: 'Email',
        description: 'Email custom scalar type with validation',
        serialize(value) {
            return parseEmail(value);
        },
        parseValue(value) {
            return parseEmail(value);
        },
        parseLiteral(ast) {
            if (ast.kind === graphql_1.Kind.STRING) {
                return parseEmail(ast.value);
            }
            else {
                throw new apollo_server_express_1.ApolloError(errorMessages_1.INVALID_EMAIL);
            }
        }
    })
};
const parseEmail = (value) => {
    if (!value)
        return undefined;
    else {
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+[.]([a-zA-Z]{2,5})$/;
        if (typeof value !== 'string' || !(regex.test(value))) {
            throw new apollo_server_express_1.ApolloError(errorMessages_1.INVALID_EMAIL);
        }
    }
    return value;
};
exports.default = {
    typeDefs,
    resolvers
};
