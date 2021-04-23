import { gql } from 'apollo-server-express'
import { ItemDatabaseType } from '../types/item/ItemDatabaseType'
// import { ItemGraphQLType } from '../types/item/ItemGraphQLType'
import { PriceGroupEnum } from '../types/PriceGroupEnum'
import { personsList } from './person'
import { PersonGraphQLType } from '../types/person/PersonGraphQLType'


const itemsList: ItemDatabaseType[] = [
    { id: 'plkol', title: 'Wonderboom II', priceGroup: PriceGroupEnum.GROUP_8, ownerID: 'a1' },
    { id: 'efdfrd', title: 'Kenwood bread maker', priceGroup: PriceGroupEnum.GROUP_9, ownerID: 'a1'  },
    { id: 'swqrtuu', title: 'FL Freezer', priceGroup: PriceGroupEnum.GROUP_8, ownerID: 'g6'  },
]



const typeDefs = gql`
    type Item {
        id: ID!
        title: String!
        priceGroup: String!
        owner: Person!
    }
    extend type Query {
        item(id: ID!): Item 
        itemsByOwner(ownerId: ID!): [Item]
        allItemsInDatabase: [Item]
    }
`

const resolvers = {
    Query: {
        item: (_root: void, args: { id: string }): ItemDatabaseType | null => {
            return itemsList.filter(item => item.id === args.id)[0]
        },
        itemsByOwner: (_root: void, args: { ownerId: string }): ItemDatabaseType[] => {
            return itemsList.filter(item => item.ownerID === args.ownerId)
        },
        allItemsInDatabase: (_root: void): ItemDatabaseType[] => {
            // console.log(itemsList)
            return itemsList
        }
    },
    Item: {
        owner: (root: ItemDatabaseType): PersonGraphQLType => {
            // console.log(root)
            const person = personsList.filter(p => p.id === root.ownerID)
            return person[0]
        }
    }
}

export default {
    typeDefs,
    resolvers
}