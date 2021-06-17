import { ItemsChatInputType } from '../../../types/item/ItemsChatInputType'
import { ItemsChatResponseType } from '../../../types/item/ItemsChatResponseType'
import { ApolloError } from 'apollo-server-express'
import { Model } from 'mongoose'
import { IChat } from '../../../mongoose-schema/chat'
import { IItem } from '../../../mongoose-schema/item'
import { IPerson } from '../../../mongoose-schema/person'




export const itemsChatService = async (
    authenticatedPerson: IPerson,
    Item: Model<IItem>,
    Chat: Model<IChat>, 
    itemsChatInput: ItemsChatInputType
): Promise<ItemsChatResponseType> => {

    if (!authenticatedPerson) throw new ApolloError('Not authenticated!')

    const { itemIdA, itemIdB } = itemsChatInput

    let itemA, itemB 

    try {
        itemA = await Item.findById(itemIdA)
        itemB = await Item.findById(itemIdB)

    } catch (error) {
        console.log(error)
    }
    if (!itemA || !itemB) throw new ApolloError('Could not find items in database!')

    try {
        const chat = await Chat
            .findOne({ $or: [ { itemIdA: itemIdA, itemIdB: itemIdB  }, { itemIdA: itemIdB, itemIdB: itemIdA  } ]})
            .sort({ createdAt: 'asc' })

        return {
            id: chat === null ? undefined : chat._id,
            itemIdA: itemIdA,
            itemIdB: itemIdB,
            posts: chat === null ? [] : chat.posts
        }

        
    } catch (error) {
        console.log(error)
        throw new ApolloError('Error finding chat in database.')
    }

}