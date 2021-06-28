"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = apollo_server_express_1.gql `
    interface MutationResponse {
        code: String!
        success: Boolean!
        message: String!
    }
`;
const resolvers = {
    MutationResponse: {
        __resolveType: () => {
            return null;
        },
    },
};
exports.default = {
    typeDefs,
    resolvers
};
