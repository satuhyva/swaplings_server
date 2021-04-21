import { gql } from 'apollo-server-express'



const typeDefs = gql`
    extend type Query {
        health: String
    }
`

const resolvers = {
    Query: {
        health: () => 'OK'
    },
}

export default {
    typeDefs,
    resolvers
}