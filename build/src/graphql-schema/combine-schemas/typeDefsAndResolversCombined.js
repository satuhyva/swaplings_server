"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const personGraphQLSchema_1 = __importDefault(require("../person/schema/personGraphQLSchema"));
const itemGraphQLSchema_1 = __importDefault(require("../item/schema/itemGraphQLSchema"));
const serverGraphQLSchema_1 = __importDefault(require("../server/serverGraphQLSchema"));
const apollo_server_express_1 = require("apollo-server-express");
const username_1 = __importDefault(require("../custom-scalars/username"));
const password_1 = __importDefault(require("../custom-scalars/password"));
const email_1 = __importDefault(require("../custom-scalars/email"));
const priceGroup_1 = __importDefault(require("../custom-scalars/priceGroup"));
const mutationResponse_1 = __importDefault(require("../interfaces/mutationResponse"));
const separateSchemas = [
    personGraphQLSchema_1.default,
    username_1.default,
    password_1.default,
    email_1.default,
    priceGroup_1.default,
    mutationResponse_1.default,
    itemGraphQLSchema_1.default,
    serverGraphQLSchema_1.default
];
let typeDefsCombined = [apollo_server_express_1.gql `
        type Query
        type Mutation
    `];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let resolversAllCombined = [];
separateSchemas.forEach(schema => {
    const { typeDefs, resolvers } = schema;
    if (typeDefs) {
        typeDefsCombined = [...typeDefsCombined, typeDefs];
    }
    if (resolvers !== undefined) {
        for (const [name, content] of Object.entries(resolvers)) {
            let resolverGroupToUpdate;
            resolversAllCombined.forEach(group => {
                if (Object.keys(group)[0] === name) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    resolverGroupToUpdate = group;
                }
            });
            if (resolverGroupToUpdate === undefined) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const newResolverGroup = {};
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                newResolverGroup[name] = content;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                resolversAllCombined = [...resolversAllCombined, newResolverGroup];
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const toUpdate = Object.values(resolverGroupToUpdate)[0];
                for (const [resolverName, resolverFunction] of Object.entries(content)) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    toUpdate[resolverName] = resolverFunction;
                }
            }
        }
    }
});
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const typeDefsAndResolversCombined = { typeDefs: typeDefsCombined, resolvers: resolversAllCombined };
exports.default = typeDefsAndResolversCombined;
