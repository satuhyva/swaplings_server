import { gql, ApolloError } from 'apollo-server-express'
import { GraphQLScalarType, Kind } from 'graphql'
import { INVALID_PASSWORD } from './errorMessages'


const typeDefs = gql`
    scalar Password
`


const resolvers = {
    Password: new GraphQLScalarType({
        name: 'Password',
        description: 'Password custom scalar type with validation',
        serialize(value) {
            return parsePassword(value)
        },
        parseValue(value) {
            return parsePassword(value)
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
                return parsePassword(ast.value)
            } else {
                throw new ApolloError(INVALID_PASSWORD)
            }
        }
    })
}

const parsePassword = (value: unknown): string => {
    if (!value || !(typeof value === 'string' ) || value.length < 8 || value.length > 30) {
        throw new ApolloError(INVALID_PASSWORD)
    }
    return value
}


export default {
    typeDefs,
    resolvers
}

