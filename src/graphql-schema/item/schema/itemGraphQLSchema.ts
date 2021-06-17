import { gql } from 'apollo-server-express'
import { Model } from 'mongoose'
import { IItem } from '../../../mongoose-schema/item'
import { IPerson } from '../../../mongoose-schema/person'
import { IChat } from '../../../mongoose-schema/chat'
import { addItemService } from '../services/addItemService'
import { AddItemInputType } from '../../../types/item/AddItemInputType'
import { AddItemResponseType } from '../../../types/item/AddItemResponseType'
import { PersonDatabaseType } from '../../../types/person/PersonDatabaseType'
import { getPersonService } from '../../person/services/getPersonService'
import { ItemDatabaseType } from '../../../types/item/ItemDatabaseType'
import { myItemsService } from '../services/myItemsService'
import { matchedToOrFromService } from '../services/matchedToOrFromService'
import { ItemPublicType } from '../../../types/item/ItemPublicType'
import { ChangeMatchInputType } from '../../../types/item/ChangeMatchInputType'
import { ChangeMatchResponseType } from '../../../types/item/ChangeMatchResponseType'
import { addMatchService } from '../services/addMatchService'
import { BrowseItemsByPageInputType, BrowseItemsByPageResponseType } from '../../../types/item/BrowseItemsByPageResponseType'
import { browseItemsByPageService } from '../services/browseItemsByPageService'
import { removeMatchService } from '../services/removeMatchService'
import { AddPostResponseType } from '../../../types/item/AddPostResponseType'
import { AddPostInputType } from '../../../types/item/AddPostInputType'
import { addPostService } from '../services/addPostService'
import { ItemsChatInputType } from '../../../types/item/ItemsChatInputType'
import { ItemsChatResponseType } from '../../../types/item/ItemsChatResponseType'
import { itemsChatService } from '../services/itemsChatService'




const typeDefs = gql`

    input AddItemInput {
        title: String! 
        priceGroup: PriceGroup! 
        description: String! 
        brand: String
        imagePublicId: String
        imageSecureUrl: String
    }

    input ChangeMatchInput {
        myItemId: ID!
        itemToId: ID!
    }

    input BrowseItemsInput {
        priceGroups: [PriceGroup]
        phrasesInTitle: [String]
        phrasesInDescription: [String]
        brands: [String]
    }

    input BrowseItemsByPageInput {
        first: Int
        after: String
        browseItemsInput: BrowseItemsInput!
    }

    input AddPostInput {
        itemIdA: ID!
        itemIdB: ID!
        post: String!
    }

    input ItemsChatInput {
        itemIdA: ID!
        itemIdB: ID!
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

    type Post {
        post: String!
        postingItemId: ID!
        createdAt: String
    }

    type Chat {
        id: ID!
        itemIdA: ID!
        personIdA: ID!
        itemIdB: ID!
        personIdB: ID!  
        posts: [Post]!      
    }

    type ItemsChatResponse {
        id: ID
        itemIdA: ID!
        itemIdB: ID! 
        posts: [Post]! 
    }
    
    type AddItemResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        item: Item
    }

    type ChangeMatchResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        myItem: Item
    }

    type AddPostResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        chat: Chat
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


    type BrowseItemsByPageResponse {
        edges: [Edge]
        pageInfo: PageInfo
    }


    extend type Query {
        myItems: [Item]
        browseItemsByPage(browseItemsByPageInput: BrowseItemsByPageInput!): BrowseItemsByPageResponse
        itemsChat(itemsChatInput: ItemsChatInput!): ItemsChatResponse
    }  

    extend type Mutation {
        addItem(addItemInput: AddItemInput!): AddItemResponse
        addMatch(changeMatchInput: ChangeMatchInput): ChangeMatchResponse
        removeMatch(changeMatchInput: ChangeMatchInput): ChangeMatchResponse
        addPost(addPostInput: AddPostInput!): AddPostResponse
    }
`



const resolvers = {

    Query: {
      
      myItems: async (_root: void, _args: void, context: { authenticatedPerson: IPerson, Item: Model<IItem> }): Promise<ItemDatabaseType[]> => {
        return await myItemsService(context.authenticatedPerson, context.Item)
      },

      browseItemsByPage: async (_root: void, args: { browseItemsByPageInput: BrowseItemsByPageInputType }, context: { authenticatedPerson: IPerson, Item: Model<IItem> }): Promise<BrowseItemsByPageResponseType> => {
        return await browseItemsByPageService(context.authenticatedPerson, context.Item, args.browseItemsByPageInput)
      },

      itemsChat: async (_root: void, args: { itemsChatInput: ItemsChatInputType }, context: { authenticatedPerson: IPerson, Item: Model<IItem>, Chat: Model<IChat> }): Promise<ItemsChatResponseType> => {
        return await itemsChatService(context.authenticatedPerson, context.Item, context.Chat, args.itemsChatInput)
      },

    },

    Mutation: {

        addItem: async (
            _root: void, 
            args: { addItemInput: AddItemInputType }, 
            context: { authenticatedPerson: IPerson, Person: Model<IPerson>, Item: Model<IItem> } 
            ): Promise<AddItemResponseType> => {
                return addItemService(context.authenticatedPerson, context.Person, context.Item, args.addItemInput)
        },

        addMatch: async (_root: void, args: { changeMatchInput: ChangeMatchInputType }, 
            context: { authenticatedPerson: IPerson, Person: Model<IPerson>, Item: Model<IItem> } 
            ): Promise<ChangeMatchResponseType> => {
                return addMatchService(context.authenticatedPerson, context.Item, args.changeMatchInput)
        },

        removeMatch: async (_root: void, args: { changeMatchInput: ChangeMatchInputType }, 
            context: { authenticatedPerson: IPerson, Person: Model<IPerson>, Item: Model<IItem>, Chat: Model<IChat> } 
            ): Promise<ChangeMatchResponseType> => {
                return removeMatchService(context.authenticatedPerson, context.Item, context.Chat, args.changeMatchInput)
        },

        addPost: async (_root: void, args: { addPostInput: AddPostInputType }, 
            context: { authenticatedPerson: IPerson, Person: Model<IPerson>, Item: Model<IItem>, Chat: Model<IChat> } 
            ): Promise<AddPostResponseType> => {
                return addPostService(context.authenticatedPerson, context.Item, context.Chat, args.addPostInput)
        },

    },

    Item: {

        owner: async (root: ItemDatabaseType, _args: void, context: { Person: Model<IPerson> }): Promise<PersonDatabaseType> => {
            return getPersonService(root.ownerPersonId, context.Person)
        },

        matchedTo: async (root: ItemDatabaseType, _args: void, context: { Item: Model<IItem> }): Promise<ItemPublicType[]> => {
            return matchedToOrFromService(root.matchedToIds, context.Item)
        },

        matchedFrom: async (root: ItemDatabaseType, _args: void, context: { Item: Model<IItem> }): Promise<ItemPublicType[]> => {
            return matchedToOrFromService(root.matchedFromIds, context.Item)
        },

    }

} 



export default {
    typeDefs,
    resolvers
}