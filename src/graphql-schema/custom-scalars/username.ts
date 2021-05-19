import { gql, ApolloError } from 'apollo-server-express'
import { GraphQLScalarType, Kind } from 'graphql'
import { INVALID_USERNAME } from './errorMessages'


const typeDefs = gql`
    scalar Username
`


const resolvers = {
    Username: new GraphQLScalarType({
        name: 'Username',
        description: 'Username custom scalar type with validation',
        serialize(value) {
            return parseUsername(value)
        },
        parseValue(value) {
            return parseUsername(value)
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
                return parseUsername(ast.value)
            } else {
                throw new ApolloError(INVALID_USERNAME)
            }
        }
    })
}

const parseUsername = (value: unknown): string => {
    if (!value || !(typeof value === 'string' ) || value.length < 3 || value.length > 25) {
        throw new ApolloError(INVALID_USERNAME)
    }
    return value
}


export default {
    typeDefs,
    resolvers
}

