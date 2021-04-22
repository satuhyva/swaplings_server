import personSchema from './person'
import itemSchema from './item'
import serverSchema from './server'
import { gql } from 'apollo-server-express'
import { DocumentNode } from 'apollo-link'



const separateSchemas = [
    personSchema,
    itemSchema,
    serverSchema
]

let typeDefsCombined: DocumentNode[] = [gql`
    type Query
    type Mutation
`]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const combinedQueries: { [key: string]: any } = {}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const combinedMutations: { [key: string]: any } = {}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let combinedCustomResolvers: { [key: string]: any } = {}


separateSchemas.forEach(schema => {
    
    typeDefsCombined = [...typeDefsCombined, schema.typeDefs]

    for (const [name, content] of Object.entries(schema.resolvers)) {
        if (name === 'Query') {
            for (const [key, value] of Object.entries(content)) {
                if (key in combinedQueries) {
                    throw new Error(`Query ${key} already exists!`)
                } else {
                    combinedQueries[key] = value
                }
              }
        } else if (name === 'Mutation') {
            for (const [key, value] of Object.entries(content)) {
                if (key in combinedMutations) {
                    throw new Error(`Mutation ${key} already exists!`)
                } else {
                    combinedMutations[key] = value
                }
              }
        } else {
            combinedCustomResolvers = { ...combinedCustomResolvers, ...schema.resolvers }
        }
    }
})



const resolversCombined = { Query: combinedQueries, Mutation: combinedMutations, ...combinedCustomResolvers }
const typeDefsAndResolversCombined = { typeDefs: typeDefsCombined, resolvers: resolversCombined }

export default typeDefsAndResolversCombined

