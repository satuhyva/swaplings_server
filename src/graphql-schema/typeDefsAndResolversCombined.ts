import personSchema from './person/personGraphQLSchema'
import itemSchema from './item/itemGraphQLSchema'
import serverSchema from './server/serverGraphQLSchema'
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
let resolversAllCombined: any[] = []

separateSchemas.forEach(schema => {
    typeDefsCombined = [...typeDefsCombined, schema.typeDefs]

    for (const [name, content] of Object.entries(schema.resolvers)) {
        let resolverGroupToUpdate
        resolversAllCombined.forEach(group => {
            if (Object.keys(group)[0] === name) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                resolverGroupToUpdate = group
            }
        })
        if (resolverGroupToUpdate === undefined) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newResolverGroup: { [key: string]: any } = {}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            newResolverGroup[name] = content
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            resolversAllCombined = [ ...resolversAllCombined, newResolverGroup]
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const toUpdate: any = Object.values(resolverGroupToUpdate)[0]
            for (const [resolverName, resolverFunction] of Object.entries(content)) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                toUpdate[resolverName] = resolverFunction
            }
        }
    }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const typeDefsAndResolversCombined = { typeDefs: typeDefsCombined, resolvers: resolversAllCombined }

export default typeDefsAndResolversCombined

