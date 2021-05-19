import { gql } from 'apollo-server-express'



const typeDefs = gql`
    interface MutationResponse {
        code: String!
        success: Boolean!
        message: String!
    }
`


const resolvers = undefined


export default {
    typeDefs,
    resolvers
}
