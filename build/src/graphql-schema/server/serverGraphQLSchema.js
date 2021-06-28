"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = apollo_server_express_1.gql `
    extend type Query {
        health: String
    }
`;
const resolvers = {
    Query: {
        health: () => 'OK'
    },
};
exports.default = {
    typeDefs,
    resolvers
};
