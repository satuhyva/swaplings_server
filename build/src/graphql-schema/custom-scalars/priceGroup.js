"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPriceGroup = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const graphql_1 = require("graphql");
const errorMessages_1 = require("./errorMessages");
const PriceGroupEnum_1 = require("../../types/price-group/PriceGroupEnum");
const isPriceGroup = (priceGroup) => {
    return !Object.values(PriceGroupEnum_1.PriceGroupEnum).every(groupValue => groupValue !== priceGroup);
};
exports.isPriceGroup = isPriceGroup;
const typeDefs = apollo_server_express_1.gql `
    scalar PriceGroup
`;
const resolvers = {
    PriceGroup: new graphql_1.GraphQLScalarType({
        name: 'PriceGroup',
        description: 'PriceGroup custom scalar type with validation',
        serialize(value) {
            return parsePriceGroup(value);
        },
        parseValue(value) {
            return parsePriceGroup(value);
        },
        parseLiteral(ast) {
            if (ast.kind === graphql_1.Kind.STRING) {
                return parsePriceGroup(ast.value);
            }
            else {
                throw new apollo_server_express_1.ApolloError(errorMessages_1.INVALID_PRICEGROUP);
            }
        }
    })
};
const parsePriceGroup = (value) => {
    if (typeof value === 'string' && exports.isPriceGroup(value))
        return value;
    throw new apollo_server_express_1.ApolloError(errorMessages_1.INVALID_PRICEGROUP);
};
exports.default = {
    typeDefs,
    resolvers
};
