import { ApolloError } from 'apollo-server-express'
import { Model } from 'mongoose'
import { IItem } from '../../mongoose-schema/item'
import { 
    COULD_NOT_FIND_ITEM_TO_BE_MATCHED,
    NO_MATCH_TO_ITEM_ITSELF, 
    NO_MATCHES_BETWEEN_ITEMS_OF_ONE_PERSON, 
    THIS_WAY_MATCH_ALREADY_EXISTS 
} from '../../utils/errorMessages'



export const addItemMatch = async (Item: Model<IItem>, interestedItemId: string, targetItemId: string): Promise<boolean> => {

    const interestedItem: IItem | null = await Item.findById(interestedItemId)
    const targetItem: IItem | null = await Item.findById(targetItemId)
    if (!interestedItem) throw new ApolloError(COULD_NOT_FIND_ITEM_TO_BE_MATCHED + ' FROM.')
    if (!targetItem) throw new ApolloError(COULD_NOT_FIND_ITEM_TO_BE_MATCHED + ' TO.')

    if (interestedItem === targetItem) throw new ApolloError(NO_MATCH_TO_ITEM_ITSELF)
    if (interestedItem.ownerPersonId.toString() === targetItem.ownerPersonId.toString()) throw new ApolloError(NO_MATCHES_BETWEEN_ITEMS_OF_ONE_PERSON)
    if (targetItem.matchedFromIds.includes(interestedItemId)) throw new ApolloError(THIS_WAY_MATCH_ALREADY_EXISTS)

    interestedItem.matchedToIds = [...interestedItem.matchedToIds, targetItemId]
    targetItem.matchedFromIds = [...targetItem.matchedFromIds, interestedItemId]
    
    const session = await Item.startSession()
    session.startTransaction()
    try {
        await interestedItem.save({ session: session })
        await targetItem.save({ session: session })
    } catch (error) {
        await session.abortTransaction()
        throw new ApolloError('Error in adding match between items. Error: ', error)
    }
    session.endSession()

    if (targetItem.matchedToIds.includes(interestedItemId)) {
        return true
    }
    return false
}
