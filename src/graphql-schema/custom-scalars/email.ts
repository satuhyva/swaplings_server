import { gql, ApolloError } from 'apollo-server-express'
import { GraphQLScalarType, Kind } from 'graphql'
import { INVALID_EMAIL } from './errorMessages'


const typeDefs = gql`
    scalar Email
`


const resolvers = {
    Email: new GraphQLScalarType({
        name: 'Email',
        description: 'Email custom scalar type with validation',
        serialize(value) {
            return parseEmail(value)
        },
        parseValue(value) {
            return parseEmail(value)
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
                return parseEmail(ast.value)
            } else {
                throw new ApolloError(INVALID_EMAIL)
            }
        }
    })
}

const parseEmail = (value: unknown): string | undefined => {
    if (!value) return undefined
    else {
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+[.]([a-zA-Z]{2,5})$/
        if (typeof value !== 'string' || !(regex.test(value))) {
            throw new ApolloError(INVALID_EMAIL)
        }
    }
    return value
}


export default {
    typeDefs,
    resolvers
}

