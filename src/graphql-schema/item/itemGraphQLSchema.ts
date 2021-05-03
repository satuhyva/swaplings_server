import { gql, ApolloError } from 'apollo-server-express'
import { Model } from 'mongoose'
import { IItem } from '../../mongoose-schema/item'
import { IPerson } from '../../mongoose-schema/person'
import { IDiscussion } from '../../mongoose-schema/discussion'
import { ItemDatabaseType } from '../../types/item/ItemDatabaseType'
import { ItemWithMatchedToItemsDatabaseType } from '../../types/item/ItemWithMatchedToItemsDatabaseType'
import { ItemWithMatchedFromItemsDatabaseType } from '../../types/item/ItemWithMatchedFromItemsDatabaseType'
import { PersonDatabaseType } from '../../types/person/PersonDatabaseType'
import { PriceGroupEnum } from '../../types/price-group/PriceGroupEnum'
import { ItemPublicDatabaseType } from '../../types/item/ItemPublicDatabaseType'
import { getItemPublicDatabaseType } from './getItemPublicDatabaseType'
import { getItemDatabaseType } from './getItemDatabaseType'


const typeDefs = gql`

    type PublicItem {
        id: ID!
        title: String!
        priceGroup: String!
        description: String!
        image_public_id: String
        image_secure_url: String
    }

    type PrivateItem {
        id: ID!
        title: String!
        priceGroup: String!
        description: String!
        image_public_id: String
        image_secure_url: String
        owner: PrivatePerson!
        matchedTo: [PublicItem]!
        matchedFrom: [PublicItem]!
    }

    extend type Query {
        allPublicItemsInDatabase: [PublicItem]
        allPrivateItemsByOwner(username: String!): [PrivateItem]
        privateItemById(itemId: ID!): PrivateItem
        publicItemSearch(priceGroup: String!): [PublicItem]
    }  

    extend type Mutation {
        addNewItemToPerson(username: String!, title: String!, description: String!, priceGroup: String!): PrivateItem
        addItemMatch(targetItemId: ID!, interestedItemId: ID!): Boolean
        cancelItemMatch(cancellingItemId: ID!, matchedItemId: ID!): Boolean
        setItemImage(itemId: ID!, image_public_id: String!, image_secure_url: String!): Boolean
        discussItem(itemFromId: ID!, itemToId: ID!, username: String!, content: String!): Boolean
        
    }
`



const resolvers = {
    Query: {

        allPublicItemsInDatabase: async (_root: void, _args: void, context: { Item: Model<IItem> }): Promise<ItemPublicDatabaseType[]> => {
            const { Item } = context
            const allItems = await Item.find({})
            return allItems.map(item => getItemPublicDatabaseType(item))
        },

        allPrivateItemsByOwner: async (_root: void, args: { username: string }, context: { Person: Model<IPerson>, Item: Model<IItem> }): Promise<ItemDatabaseType[]> => {
            const { Person, Item } = context
            const person: IPerson | null = await Person.findOne({ username: args.username })
            if (!person) throw new ApolloError('Could not find person!')
            const items = await Item.find({ ownerPersonId: person._id })
            return items.map(item => getItemDatabaseType(item))
        },

        privateItemById: async (_root: void, args: { itemId: string }, context: { Item: Model<IItem> }): Promise<ItemDatabaseType> => {
            const { Item } = context
            const item = await Item.findById(args.itemId)
            if (!item) throw new ApolloError('Item could not be found!')
            return getItemDatabaseType(item)
        },

        publicItemSearch: async (_root: void, args: { priceGroup: PriceGroupEnum }, context: { Item: Model<IItem> }): Promise<ItemPublicDatabaseType[]> => {
            const { Item } = context
            const itemsInPriceGroup = await Item.find({ priceGroup: args.priceGroup })
            return itemsInPriceGroup.map(item => getItemPublicDatabaseType(item))
        }
    },

    Mutation: {

        addNewItemToPerson: async (
            _root: void, 
            args: { username: string, title: string, description: string, priceGroup: string }, 
            context: { Person: Model<IPerson>, Item: Model<IItem> }
            ): Promise<ItemDatabaseType> => {

                const { Person, Item } = context
                const person: IPerson | null = await Person.findOne({ username: args.username })
                if (!person) throw new ApolloError('Could not find person!')

                const itemToAdd = new Item({ title: args.title, description: args.description, priceGroup: args.priceGroup, ownerPersonId: person._id })
                const savedItem: IItem = await itemToAdd.save()
                
                person.ownedItemIds = [...person.ownedItemIds, savedItem._id]
                await person.save()
                return getItemDatabaseType(savedItem)
        },

        addItemMatch: async (_root: void, args: { targetItemId: string, interestedItemId: string }, context: { Item: Model<IItem> }): Promise<boolean> => {
            const { Item } = context
            const interestedItem: IItem | null = await Item.findById(args.interestedItemId)
            const targetItem: IItem | null = await Item.findById(args.targetItemId)

            if (!interestedItem) throw new ApolloError('Could not find INTERESTED item!')
            if (!targetItem) throw new ApolloError('Could not find TARGET item!')
            if (interestedItem.ownerPersonId.toString() === targetItem.ownerPersonId.toString()) throw new ApolloError('Person cannot match his or her own items with each other!')
            if (targetItem.matchedFromIds.includes(args.interestedItemId)) throw new ApolloError('Items have already been matched in this way!')

            interestedItem.matchedToIds = [...interestedItem.matchedToIds, args.targetItemId]
            await interestedItem.save()
            targetItem.matchedFromIds = [...targetItem.matchedFromIds, args.interestedItemId]
            await targetItem.save()
            if (targetItem.matchedToIds.includes(args.interestedItemId)) {
                return true
            }
            return false
        },

        cancelItemMatch: async(_root: void, args: { cancellingItemId: string, matchedItemId: string }, context: { Item: Model<IItem> }): Promise<boolean> => {
            const { Item } = context
            const cancellingItem: IItem | null = await Item.findById(args.cancellingItemId)
            const matchedItem: IItem | null = await Item.findById(args.matchedItemId)
            if (!cancellingItem) throw new ApolloError('Could not find CANCELLING item!')
            if (!matchedItem) throw new ApolloError('Could not find MATCHED item!')
            cancellingItem.matchedToIds = cancellingItem.matchedToIds.filter(itemId => itemId.toString() !== args.matchedItemId.toString())
            await cancellingItem.save()
            matchedItem.matchedFromIds = matchedItem.matchedFromIds.filter(itemId => itemId.toString() !== args.cancellingItemId.toString())
            await matchedItem.save()
            return true
        },

        setItemImage: async (_root: void, args: { itemId: string, image_public_id: string, image_secure_url: string }, context: { Item: Model<IItem> }): Promise<boolean> => {
            const { Item } = context
            try {
                await Item.findByIdAndUpdate(args.itemId, { image_public_id: args.image_public_id, image_secure_url: args.image_secure_url }, { new: true })
                return true
            } catch (error) {
                throw new ApolloError('Could not update image data to item. Error:', error)
            }
        },

        discussItem: async (
            _root: void, 
            args: { itemFromId: string, itemToId: string, username: string, content: string }, 
            context: { Person: Model<IPerson>, Item: Model<IItem>, Discussion: Model<IDiscussion> }
            ): Promise<boolean> => {
            const { Person, Item, Discussion } = context
            const personDiscussing = await Person.findOne({ username: args.username })
            if (!personDiscussing) throw new ApolloError('Could not find person!')
            const itemFrom = await Item.findById(args.itemFromId).populate('ownerPersonId')
            if (!itemFrom) throw new ApolloError('Could not find FROM item!')
            const itemTo = await Item.findById(args.itemToId).populate('ownerPersonId')
            if (!itemTo) throw new ApolloError('Could not find TO item!')
            if ((itemFrom.ownerPersonId as unknown as  { username: string }).username !== args.username && 
                (itemTo.ownerPersonId as unknown as  { username: string }).username !== args.username) {
                throw new ApolloError('Person trying to discuss is not an owner of items in this discussion!')
            }
            const newDiscussionPiece = { content: args.content, postingPersonId: personDiscussing._id, createdAt: new Date().toISOString() }
            const discussion = await Discussion.findOne({ itemFromId: args.itemFromId, itemToId: args.itemToId })
            if (!discussion) {
                const newDiscussion = new Discussion({ itemFromId: args.itemFromId, itemToId: args.itemToId, story: newDiscussionPiece })
                await newDiscussion.save()
                return true
            } else {
                discussion.story = [...discussion.story, newDiscussionPiece ]
                await discussion.save()
                return true
            }
        }
    },

    PrivateItem: {

        owner: async (root: ItemDatabaseType, _args: void, context: { Person: Model<IPerson> }): Promise<Omit<PersonDatabaseType, 'passwordHash'>> => {
            const { Person } = context
            const ownerPerson: IPerson | null = await Person.findById(root.ownerPersonId)
            if (!ownerPerson) throw new ApolloError('Could not find person!')
            return { id: ownerPerson._id, username: ownerPerson.username, email: ownerPerson.email, ownedItemdIds: ownerPerson.ownedItemIds }
        },

        matchedTo: async (root: ItemDatabaseType, _args: void, context: { Item: Model<IItem> }): Promise<ItemPublicDatabaseType[]> => {
            const { Item } = context
            const itemWithMatchedToItems = await Item.findById(root.id).populate('matchedToIds') as unknown as ItemWithMatchedToItemsDatabaseType | null
            if (!itemWithMatchedToItems) throw new ApolloError('Could not find item!')
            return itemWithMatchedToItems.matchedToIds.map(matchedTo => getItemPublicDatabaseType(matchedTo))
        },

        matchedFrom: async (root: ItemDatabaseType, _args: void, context: { Item: Model<IItem> }): Promise<Omit<ItemDatabaseType, 'ownerPersonId' | 'matchedToIds' | 'matchedFromIds'>[]> => {
            const { Item } = context
            const itemWithMatchedFromItems = await Item.findById(root.id).populate('matchedFromIds') as unknown as ItemWithMatchedFromItemsDatabaseType | null
            if (!itemWithMatchedFromItems) throw new ApolloError('Could not find item!')
            return itemWithMatchedFromItems.matchedFromIds.map(matchedFrom => getItemPublicDatabaseType(matchedFrom))
        },

    }


}

export default {
    typeDefs,
    resolvers
}