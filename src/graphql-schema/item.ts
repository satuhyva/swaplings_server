import { gql, ApolloError } from 'apollo-server-express'
import { Model } from 'mongoose'
import { IItem } from '../mongoose-schema/item'
import { IPerson } from '../mongoose-schema/person'
import { ItemDatabaseType } from '../types/item/ItemDatabaseType'
import { ItemWithMatchedToItemsDatabaseType } from '../types/item/ItemWithMatchedToItemsDatabaseType'
import { ItemWithMatchedFromItemsDatabaseType } from '../types/item/ItemWithMatchedFromItemsDatabaseType'
import { PersonDatabaseType } from '../types/person/PersonDatabaseType'




const typeDefs = gql`
    type PublicItem {
        id: ID!
        title: String!
        priceGroup: String!
        description: String!
    }
    type PrivateItem {
        id: ID!
        title: String!
        priceGroup: String!
        owner: PrivatePerson!
        description: String!
        matchedTo: [PublicItem]!
        matchedFrom: [PublicItem]!
    }
    extend type Query {
        allPublicItemsInDatabase: [PublicItem]
        allItemsByOwner(username: String!): [PrivateItem]
        privateItemById(itemId: ID!): PrivateItem
    }    
    extend type Mutation {
        addNewItemToPerson(username: String!, title: String!, description: String!, priceGroup: String!): PrivateItem
        addItemMatch(targetItemId: ID!, interestedItemId: ID!): Boolean
    }
`

const resolvers = {
    Query: {
        allPublicItemsInDatabase: async (_root: void, _args: void, context: { Item: Model<IItem> }): Promise<Omit<ItemDatabaseType, 'ownerPersonId' | 'matchedToIds' | 'matchedFromIds'>[]> => {
            const { Item } = context
            const allItems = await Item.find({})
            return allItems.map(item => {
                return {
                    id: item._id, 
                    title: item.title, 
                    description: item.description, 
                    priceGroup: item.priceGroup, 
                }
            })
        },
        allItemsByOwner: async (_root: void, args: { username: string }, context: { Person: Model<IPerson>, Item: Model<IItem> }): Promise<ItemDatabaseType[]> => {
            const { Person, Item } = context
            const person: IPerson | null = await Person.findOne({ username: args.username })
            if (!person) throw new ApolloError('Could not find person!')
            const items = await Item.find({ ownerPersonId: person._id })
            return items.map(item => {
                return { 
                    id: item._id, 
                    title: item.title, 
                    description: item.description, 
                    priceGroup: item.priceGroup, 
                    ownerPersonId: item.ownerPersonId,
                    matchedToIds: item.matchedToIds,
                    matchedFromIds: item.matchedFromIds
                }
            })
        },
        privateItemById: async (_root: void, args: { itemId: string }, context: { Item: Model<IItem> }): Promise<ItemDatabaseType> => {
            const { Item } = context
            const item = await Item.findById(args.itemId)
            if (!item) throw new ApolloError('Item could not be found!')
            return { 
                id: item._id, 
                title: item.title, 
                description: item.description, 
                priceGroup: item.priceGroup, 
                ownerPersonId: item.ownerPersonId,
                matchedToIds: item.matchedToIds,
                matchedFromIds: item.matchedFromIds
            }
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
                return { 
                    id: savedItem._id, 
                    title: savedItem.title, 
                    description: savedItem.description, 
                    priceGroup: savedItem.priceGroup, 
                    ownerPersonId: person._id,
                    matchedToIds: savedItem.matchedToIds,
                    matchedFromIds: savedItem.matchedFromIds 
                }
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
        }
    },
    PrivateItem: {
        owner: async (root: ItemDatabaseType, _args: void, context: { Person: Model<IPerson> }): Promise<Omit<PersonDatabaseType, 'passwordHash'>> => {
            const { Person } = context
            const ownerPerson: IPerson | null = await Person.findById(root.ownerPersonId)
            if (!ownerPerson) throw new ApolloError('Could not find person!')
            return { id: ownerPerson._id, username: ownerPerson.username, email: ownerPerson.email, ownedItemdIds: ownerPerson.ownedItemIds }
        },
        matchedTo: async (root: ItemDatabaseType, _args: void, context: { Item: Model<IItem> }): Promise<Omit<ItemDatabaseType, 'ownerPersonId' | 'matchedToIds' | 'matchedFromIds'>[]> => {
            const { Item } = context
            const itemWithMatchedToItems = await Item.findById(root.id).populate('matchedToIds') as unknown as ItemWithMatchedToItemsDatabaseType | null
            if (!itemWithMatchedToItems) throw new ApolloError('Could not find item!')
            return itemWithMatchedToItems.matchedToIds.map(matchedTo => {
                return {
                    id: matchedTo._id,
                    title: matchedTo.title,
                    description: matchedTo.description,
                    priceGroup: matchedTo.priceGroup
                }
            })
        },
        matchedFrom: async (root: ItemDatabaseType, _args: void, context: { Item: Model<IItem> }): Promise<Omit<ItemDatabaseType, 'ownerPersonId' | 'matchedToIds' | 'matchedFromIds'>[]> => {
            const { Item } = context
            const itemWithMatchedFromItems = await Item.findById(root.id).populate('matchedFromIds') as unknown as ItemWithMatchedFromItemsDatabaseType | null
            if (!itemWithMatchedFromItems) throw new ApolloError('Could not find item!')
            return itemWithMatchedFromItems.matchedFromIds.map(matchedFrom => {
                return {
                    id: matchedFrom._id,
                    title: matchedFrom.title,
                    description: matchedFrom.description,
                    priceGroup: matchedFrom.priceGroup
                }
            })
        }
    }


}

export default {
    typeDefs,
    resolvers
}