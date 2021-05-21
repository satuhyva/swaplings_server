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


const typeDefs = gql`

    input AddItemInput {
        title: String! 
        priceGroup: PriceGroup! 
        description: String! 
        brand: String
        image_public_id: String
        image_secure_url: String
    }

    type Item {
        id: ID!
        title: String!
        priceGroup: PriceGroup! 
        description: String! 
        brand: String
        image_public_id: String
        image_secure_url: String
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

    extend type Query {
        myItems: [Item]
    }  

    extend type Mutation {
        addItem(addItemInput: AddItemInput!): AddItemResponse
        # addNewItemToPerson(itemInput: AddNewItemToPersonInput!): PrivateItem
        # addItemMatch(targetItemId: ID!, interestedItemId: ID!): Boolean
        # cancelItemMatch(cancellingItemId: ID!, matchedItemId: ID!): Boolean
        # setItemImage(itemId: ID!, image_public_id: String!, image_secure_url: String!): Boolean
        # discussItem(itemFromId: ID!, itemToId: ID!, username: String!, content: String!): Boolean
        # markItemAsSwapped: kumpikin osapuoli osaltaan voi merkitä, että on swapped, silloin häviää henkilöltä näkyvistä
        # kun toinenkin merkitsee swapped, silloin poistuu molemmat itemit ja kaikki keskustelut
        # LISÄÄ SWAPPED-TILA ITEMILLE! ja tämän mukaisesti hakuja...
    }
`



const resolvers = {

    Query: {
      
      myItems: async (_root: void, _args: void, context: { authenticatedPerson: IPerson, Item: Model<IItem> }): Promise<ItemDatabaseType[]> => {
        const items = await myItemsService(context.authenticatedPerson, context.Item)
        return items
      }  

    },

    Mutation: {

        addItem: async (
            _root: void, 
            args: { addItemInput: AddItemInputType }, 
            context: { authenticatedPerson: IPerson, Person: Model<IPerson>, Item: Model<IItem> } 
            ): Promise<AddItemResponseType> => {
                const addedItemResponse = await addItemService(context.authenticatedPerson, context.Person, context.Item, args.addItemInput)
                return addedItemResponse
        }

    },

    Item: {

        owner: async (root: ItemDatabaseType, _args: void, context: { Person: Model<IPerson> }): Promise<PersonDatabaseType> => {
            const person = await getPersonService(root.ownerPersonId, context.Person)
            return person
        },

        matchedTo: async (root: ItemDatabaseType, _args: void, context: { Item: Model<IItem> }): Promise<ItemPublicType[]> => {
            const items = await matchedToOrFromService(root.matchedToIds, context.Item)
            return items
        },

        matchedFrom: async (root: ItemDatabaseType, _args: void, context: { Item: Model<IItem> }): Promise<ItemPublicType[]> => {
            const items = await matchedToOrFromService(root.matchedFromIds, context.Item)
            return items
        },

    }

} 



//{
    // Query: {

    // },

    // Mutation: {

        // addItemMatch: async (_root: void, args: { targetItemId: string, interestedItemId: string }, context: { Item: Model<IItem> }): Promise<boolean> => {
        //     const { Item } = context
        //     const interestedItem: IItem | null = await Item.findById(args.interestedItemId)
        //     const targetItem: IItem | null = await Item.findById(args.targetItemId)

        //     if (!interestedItem) throw new ApolloError('Could not find INTERESTED item!')
        //     if (!targetItem) throw new ApolloError('Could not find TARGET item!')
        //     if (interestedItem.ownerPersonId.toString() === targetItem.ownerPersonId.toString()) throw new ApolloError('Person cannot match his or her own items with each other!')
        //     if (targetItem.matchedFromIds.includes(args.interestedItemId)) throw new ApolloError('Items have already been matched in this way!')

        //     interestedItem.matchedToIds = [...interestedItem.matchedToIds, args.targetItemId]
        //     await interestedItem.save()
        //     targetItem.matchedFromIds = [...targetItem.matchedFromIds, args.interestedItemId]
        //     await targetItem.save()
        //     if (targetItem.matchedToIds.includes(args.interestedItemId)) {
        //         return true
        //     }
        //     return false
        // },

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

        // setItemImage: async (_root: void, args: { itemId: string, image_public_id: string, image_secure_url: string }, context: { Item: Model<IItem> }): Promise<boolean> => {
        //     const { Item } = context
        //     try {
        //         await Item.findByIdAndUpdate(args.itemId, { image_public_id: args.image_public_id, image_secure_url: args.image_secure_url }, { new: true })
        //         return true
        //     } catch (error) {
        //         throw new ApolloError('Could not update image data to item. Error:', error)
        //     }
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

    // PrivateItem: {

    //     owner: async (root: ItemDatabaseType, _args: void, context: { Person: Model<IPerson> }): Promise<Omit<PersonDatabaseType, 'passwordHash'>> => {
    //         const { Person } = context
    //         const ownerPerson: IPerson | null = await Person.findById(root.ownerPersonId)
    //         if (!ownerPerson) throw new ApolloError('Could not find person!')
    //         return { id: ownerPerson._id, username: ownerPerson.username, email: ownerPerson.email, ownedItemdIds: ownerPerson.ownedItemIds }
    //     },

    //     matchedTo: async (root: ItemDatabaseType, _args: void, context: { Item: Model<IItem> }): Promise<ItemPublicDatabaseType[]> => {
    //         const { Item } = context
    //         const itemWithMatchedToItems = await Item.findById(root.id).populate('matchedToIds') as unknown as ItemWithMatchedToItemsDatabaseType | null
    //         if (!itemWithMatchedToItems) throw new ApolloError('Could not find item!')
    //         return itemWithMatchedToItems.matchedToIds.map(matchedTo => getItemPublicDatabaseType(matchedTo))
    //     },

    //     matchedFrom: async (root: ItemDatabaseType, _args: void, context: { Item: Model<IItem> }): Promise<Omit<ItemDatabaseType, 'ownerPersonId' | 'matchedToIds' | 'matchedFromIds'>[]> => {
    //         const { Item } = context
    //         const itemWithMatchedFromItems = await Item.findById(root.id).populate('matchedFromIds') as unknown as ItemWithMatchedFromItemsDatabaseType | null
    //         if (!itemWithMatchedFromItems) throw new ApolloError('Could not find item!')
    //         return itemWithMatchedFromItems.matchedFromIds.map(matchedFrom => getItemPublicDatabaseType(matchedFrom))
    //     },

    // }


// }

export default {
    typeDefs,
    resolvers
}