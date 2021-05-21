import { gql, ApolloError } from 'apollo-server-express'
import { GraphQLScalarType, Kind } from 'graphql'
import { INVALID_PRICEGROUP } from './errorMessages'
import { PriceGroupEnum } from '../../types/price-group/PriceGroupEnum'


export const isPriceGroup = (priceGroup: string): boolean => {
    return  !Object.values(PriceGroupEnum).every(groupValue => groupValue !== priceGroup)
}



const typeDefs = gql`
    scalar PriceGroup
`


const resolvers = {
    PriceGroup: new GraphQLScalarType({
        name: 'PriceGroup',
        description: 'PriceGroup custom scalar type with validation',
        serialize(value) {
            return parsePriceGroup(value)
        },
        parseValue(value) {
            return parsePriceGroup(value)
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
                return parsePriceGroup(ast.value)
            } else {
                throw new ApolloError(INVALID_PRICEGROUP)
            }
        }
    })
}

const parsePriceGroup = (value: unknown): string | undefined => {
    if (typeof value === 'string' && isPriceGroup(value)) return value
    throw new ApolloError(INVALID_PRICEGROUP)
}


export default {
    typeDefs,
    resolvers
}

