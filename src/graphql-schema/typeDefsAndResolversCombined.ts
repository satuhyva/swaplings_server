
import personSchema from './person'
import itemSchema from './item'
import { gql } from 'apollo-server-express'
import { DocumentNode } from 'apollo-link'



const separateSchemas = [
    personSchema,
    itemSchema
]

let typeDefsCombined: DocumentNode[] = [gql`
    type Query
    # type Mutation
`]
// let resolversCombined = { Query: {} }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const combinedQueries: { [key: string]: any } = {}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const combinedMutations: { [key: string]: any } = {}


separateSchemas.forEach(schema => {
    typeDefsCombined = [...typeDefsCombined, schema.typeDefs]

    for (const [key, value] of Object.entries(schema.resolvers.Query)) {
        console.log(key, value)
        if (key in combinedQueries) {
            throw new Error(`Query ${key} already exists!`)
        } else {
            // We will allow adding type any resolver for we do not want to type every resolver typesctipr type here!
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            combinedQueries[key] = value
        }
      }

    //   for (const [key, value] of Object.entries(schema.resolvers.Mutation)) {
    //     console.log(key, value)
    //     if (key in combinedMutations) {
    //         throw new Error(`Mutation ${key} already exists!`)
    //     } else {
    //         // We will allow adding type any resolver for we do not want to type every resolver typesctipr type here!
    //         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //         combinedMutations[key] = value
    //     }
    //   }

    // resolversCombined = deepmerge(resolversCombined, schema.resolvers)
    // console.log(schema.typeDefs)
    // console.log(schema.resolvers)
})

const resolversCombined = { Query: combinedQueries }
// const resolversCombined = { Query: combinedQueries, Mutation: combinedMutations }
const typeDefsAndResolversCombined = { typeDefs: typeDefsCombined, resolvers: resolversCombined }

export default typeDefsAndResolversCombined

// // Construct a schema, using GraphQL schema language
// const typeDefs = gql`
//   type Query {
//     hello: String
//   }
// `

// // Provide resolver functions for your schema fields
// const resolvers = {
//   Query: {
//     hello: () => 'Hello world!',
//   },
// }

// export default { typeDefs, resolvers }