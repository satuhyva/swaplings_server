import { gql } from 'apollo-server-express'
import { Model } from 'mongoose'
import { IItem } from '../../../mongoose-schema/item'
import { IPerson } from '../../../mongoose-schema/person'
import { addItemService } from '../services/addItemService'
import { AddItemInputType } from '../../../types/item/AddItemInputType'
import { AddItemResponseType } from '../../../types/item/AddItemResponseType'
import { PersonDatabaseType } from '../../../types/person/PersonDatabaseType'
import { getPersonService } from '../../person/getPersonService'
import { ItemDatabaseType } from '../../../types/item/ItemDatabaseType'
import { myItemsService } from '../services/myItemsService'
import { matchedToOrFromService } from '../services/matchedToOrFromService'
import { ItemPublicType } from '../../../types/item/ItemPublicType'
import { AddMatchInputType } from '../../../types/item/AddMatchInputType'
import { AddMatchResponseType } from '../../../types/item/AddMatchResponseType'
import { addMatchService } from '../services/addMatchService'
import { BrowseItemsInputType } from '../../../types/item/BrowseItemsInputType'
import { browseItemsService } from '../services/browseItemsService'
import { BrowseItemsByPageInputType, BrowseItemsByPageResponseType } from '../../../types/item/BrowseItemsByPageResponseType'
import { browseItemsByPageService } from '../services/browseItemsByPageService'



const typeDefs = gql`

    input AddItemInput {
        title: String! 
        priceGroup: PriceGroup! 
        description: String! 
        brand: String
        imagePublicId: String
        imageSecureUrl: String
    }

    input AddMatchInput {
        myItemId: ID!
        itemToId: ID!
    }

    input BrowseItemsInput {
        priceGroups: [PriceGroup]
        phrasesInTitle: [String]
        phrasesInDescription: [String]
        brands: [String]
    }

    type Item {
        id: ID!
        title: String!
        priceGroup: PriceGroup! 
        description: String! 
        brand: String
        imagePublicId: String
        imageSecureUrl: String
        owner: Person!
        matchedTo: [Item]
        matchedFrom: [Item]
    }
    
    type AddItemResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        item: Item
    }

    type AddMatchResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        myItem: Item
    }

    type Edge {
        cursor: String
        node: Item
    }

    type PageInfo {
        endCursor: String
        hasNextPage: Boolean,
        startCursor: String,
        hasPreviousPage: Boolean
    }

    input BrowseItemsByPageInput {
        first: Int
        after: String
        browseItemsInput: BrowseItemsInput!
    }

    type BrowseItemsByPageResponse {
        edges: [Edge]
        pageInfo: PageInfo
    }


    extend type Query {
        myItems: [Item]
        browseItems(browseItemsInput: BrowseItemsInput!): [Item]
        browseItemsByPage(browseItemsByPageInput: BrowseItemsByPageInput!): BrowseItemsByPageResponse
        # allItems: [Item]
        # someItems: [Item]
    }  

    extend type Mutation {
        addItem(addItemInput: AddItemInput!): AddItemResponse
        addMatch(addMatchInput: AddMatchInput): AddMatchResponse
        # cancelItemMatch(cancellingItemId: ID!, matchedItemId: ID!): Boolean
        # discussItem(itemFromId: ID!, itemToId: ID!, username: String!, content: String!): Boolean
        # markItemAsSwapped: kumpikin osapuoli osaltaan voi merkitä, että on swapped, silloin häviää henkilöltä näkyvistä
        # kun toinenkin merkitsee swapped, silloin poistuu molemmat itemit ja kaikki keskustelut
        # LISÄÄ SWAPPED-TILA ITEMILLE! ja tämän mukaisesti hakuja...
    }
`



const resolvers = {

    Query: {
      
      myItems: async (_root: void, _args: void, context: { authenticatedPerson: IPerson, Item: Model<IItem> }): Promise<ItemDatabaseType[]> => {
        return await myItemsService(context.authenticatedPerson, context.Item)
      },

      browseItems: async (_root: void, args: { browseItemsInput: BrowseItemsInputType }, context: { authenticatedPerson: IPerson, Item: Model<IItem> }): Promise<ItemPublicType[]> => {
        return await browseItemsService(context.authenticatedPerson, context.Item, args.browseItemsInput)
      },

    //   allItems: async (_root: void, _args: void, context: { Item: Model<IItem> }): Promise<ItemDatabaseType[]> => {
    //     const items = await context.Item.find({})
    //     return items.map(item => getItemDatabaseType(item))
    //   }, 
    //   someItems: async (_root: void, _args: void, context: { Item: Model<IItem> }): Promise<ItemDatabaseType[]> => {
    //     const items = await context.Item.find({})
    //     const parsed = items.map(item => getItemDatabaseType(item))
    //     if (parsed.length > 1) return [parsed[0]]
    //     return []
    //   },   
      browseItemsByPage: async (_root: void, args: { browseItemsByPageInput: BrowseItemsByPageInputType }, context: { authenticatedPerson: IPerson, Item: Model<IItem> }): Promise<BrowseItemsByPageResponseType> => {
        return await browseItemsByPageService(context.authenticatedPerson, context.Item, args.browseItemsByPageInput)
      }

    },

    Mutation: {

        addItem: async (
            _root: void, 
            args: { addItemInput: AddItemInputType }, 
            context: { authenticatedPerson: IPerson, Person: Model<IPerson>, Item: Model<IItem> } 
            ): Promise<AddItemResponseType> => {
                return await addItemService(context.authenticatedPerson, context.Person, context.Item, args.addItemInput)
        },

        addMatch: async (_root: void, args: { addMatchInput: AddMatchInputType }, 
            context: { authenticatedPerson: IPerson, Person: Model<IPerson>, Item: Model<IItem> } 
            ): Promise<AddMatchResponseType> => {
                return await addMatchService(context.authenticatedPerson, context.Item, args.addMatchInput)
        }

    },

    Item: {

        owner: async (root: ItemDatabaseType, _args: void, context: { Person: Model<IPerson> }): Promise<PersonDatabaseType> => {
            return await getPersonService(root.ownerPersonId, context.Person)
        },

        matchedTo: async (root: ItemDatabaseType, _args: void, context: { Item: Model<IItem> }): Promise<ItemPublicType[]> => {
            return await matchedToOrFromService(root.matchedToIds, context.Item)
        },

        matchedFrom: async (root: ItemDatabaseType, _args: void, context: { Item: Model<IItem> }): Promise<ItemPublicType[]> => {
            return await matchedToOrFromService(root.matchedFromIds, context.Item)
        },

    }

} 



//{
    // Query: {

    // },

    // Mutation: {


        // cancelItemMatch: async(_root: void, args: { cancellingItemId: string, matchedItemId: string }, context: { Item: Model<IItem> }): Promise<boolean> => {
        //     const { Item } = context
        //     const cancellingItem: IItem | null = await Item.findById(args.cancellingItemId)
        //     const matchedItem: IItem | null = await Item.findById(args.matchedItemId)
        //     if (!cancellingItem) throw new ApolloError('Could not find CANCELLING item!')
        //     if (!matchedItem) throw new ApolloError('Could not find MATCHED item!')
        //     cancellingItem.matchedToIds = cancellingItem.matchedToIds.filter(itemId => itemId.toString() !== args.matchedItemId.toString())
        //     await cancellingItem.save()
        //     matchedItem.matchedFromIds = matchedItem.matchedFromIds.filter(itemId => itemId.toString() !== args.cancellingItemId.toString())
        //     await matchedItem.save()
        //     return true
        // },


        // discussItem: async (
        //     _root: void, 
        //     args: { itemFromId: string, itemToId: string, username: string, content: string }, 
        //     context: { Person: Model<IPerson>, Item: Model<IItem>, Discussion: Model<IDiscussion> }
        //     ): Promise<boolean> => {
        //     const { Person, Item, Discussion } = context
        //     const personDiscussing = await Person.findOne({ username: args.username })
        //     if (!personDiscussing) throw new ApolloError('Could not find person!')
        //     const itemFrom = await Item.findById(args.itemFromId).populate('ownerPersonId')
        //     if (!itemFrom) throw new ApolloError('Could not find FROM item!')
        //     const itemTo = await Item.findById(args.itemToId).populate('ownerPersonId')
        //     if (!itemTo) throw new ApolloError('Could not find TO item!')
        //     if ((itemFrom.ownerPersonId as unknown as  { username: string }).username !== args.username && 
        //         (itemTo.ownerPersonId as unknown as  { username: string }).username !== args.username) {
        //         throw new ApolloError('Person trying to discuss is not an owner of items in this discussion!')
        //     }
        //     const newDiscussionPiece = { content: args.content, postingPersonId: personDiscussing._id, createdAt: new Date().toISOString() }
        //     const discussion = await Discussion.findOne({ itemFromId: args.itemFromId, itemToId: args.itemToId })
        //     if (!discussion) {
        //         const newDiscussion = new Discussion({ itemFromId: args.itemFromId, itemToId: args.itemToId, story: newDiscussionPiece })
        //         await newDiscussion.save()
        //         return true
        //     } else {
        //         discussion.story = [...discussion.story, newDiscussionPiece ]
        //         await discussion.save()
        //         return true
        //     }
        // }
    // },


// }

export default {
    typeDefs,
    resolvers
}