import { gql } from 'apollo-server-express'



const typeDefs = gql`
    interface MutationResponse {
        code: String!
        success: Boolean!
        message: String!
    }
`


const resolvers = {
    MutationResponse: {
        __resolveType: (): null =>{
          return null
        },
      },
}


export default {
    typeDefs,
    resolvers
}
