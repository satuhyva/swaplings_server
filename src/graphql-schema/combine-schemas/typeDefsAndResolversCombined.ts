import personSchema from '../person/schema/personGraphQLSchema'
import itemSchema from '../item/schema/itemGraphQLSchema'
import serverSchema from '../server/serverGraphQLSchema'
import { gql } from 'apollo-server-express'
import { DocumentNode } from 'apollo-link'
import username from '../custom-scalars/username'
import password from '../custom-scalars/password'
import email from '../custom-scalars/email'
import priceGroup from '../custom-scalars/priceGroup'
import mutationResponse from '../interfaces/mutationResponse'


const separateSchemas = [
        personSchema,
        username,
        password,
        email,
        priceGroup,
        mutationResponse,
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
    const { typeDefs, resolvers } = schema
    if (typeDefs) {
        typeDefsCombined = [...typeDefsCombined, typeDefs]
    }
    

    if (resolvers !== undefined) {
        for (const [name, content] of Object.entries(resolvers)) {
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
    }

})

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const typeDefsAndResolversCombined = { typeDefs: typeDefsCombined, resolvers: resolversAllCombined }

export default typeDefsAndResolversCombined

