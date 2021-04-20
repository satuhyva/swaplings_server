import { gql } from 'apollo-server-express'

const itemsList = [
    { title: 'Wonderboom II', price: 150 },
    { title: 'Kenwood bread maker', price: 80 },
]

const typeDefs = gql`
    type Item {
        title: String
        price: Int
    }
    extend type Query {
        items: [Item]
    }
`

const resolvers = {
    Query: {
        items: () => itemsList
    },
    // Mutation: {
        
    // }
}

export default {
    typeDefs,
    resolvers
}