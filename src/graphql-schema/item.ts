import { gql } from 'apollo-server-express'
import { ItemDatabaseType } from '../types/item/ItemDatabaseType'
// import { ItemGraphQLType } from '../types/item/ItemGraphQLType'
import { PriceGroupEnum } from '../types/PriceGroupEnum'
import { personsList } from './person'
import { PersonType } from '../types/PersonType'



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
        allItemsInDatabase: [Item]
    }
`

const resolvers = {
    Query: {
        allItemsInDatabase: (_root: void): ItemDatabaseType[] => {
            // console.log(itemsList)
            return itemsList
        }
    },
    Item: {
        owner: (root: ItemDatabaseType): PersonType => {
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