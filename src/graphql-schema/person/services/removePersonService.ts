import { Model } from 'mongoose'
import { IChat } from '../../../mongoose-schema/chat'
import { IItem } from '../../../mongoose-schema/item'
import { IPerson } from '../../../mongoose-schema/person'
import { RemovePersonType } from '../../../types/person/RemovePersonType'
import { REMOVE_PERSON_SUCCESS, REMOVE_PERSON_UNAUTHORIZED } from '../helpers/errorMessages'
import mongoose from 'mongoose'
import { databaseError } from './removePersonDatabaseError'
import { getOthersItemsToModify } from './getOthersItemsToModify'


export const removePersonService = async (
    authenticatedPerson: IPerson, 
    Person: Model<IPerson>, 
    Item: Model<IItem>, 
    Chat: Model<IChat> 
): Promise<RemovePersonType> => {


    if (!authenticatedPerson) {
        return {
            code: '401',
            success: false,
            message: REMOVE_PERSON_UNAUTHORIZED,
            id: undefined,
            username: undefined,
            facebookName: undefined
        }
    }


    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        // Completele remove all CHATS where the person is involved
        await Chat.deleteMany({ $or: [ { personIdA: authenticatedPerson._id }, { personIdB: authenticatedPerson._id } ]})
    } catch (error) {
        console.log(error)
        return await databaseError(session, 'Error removing CHAT.', authenticatedPerson)
    }

    try {
        // Completely remove all MATCHES (other person's items, that have been matched to or from the person's items)
        const person = await Person.findById(authenticatedPerson._id).populate('ownedItemIds')
        if (!person) throw new Error('Could not find person!')
        const ownedItems = person as unknown as { ownedItemIds: { _id: string, matchedToIds: string[], matchedFromIds: string[] }[] }

        // Because of the "optimisticConcurrency: true" -setting, we cannot perform simultaneously updating
        // for single items (in one thread to modify matchedTo list, and in another thread modify matchedFrom list of the same item). 
        // Perhaps it is best to modify each item's matchedTo and matchedFrom fields at one go.
        // In the below dictionary the key is the id of the target item (by other person) and lists are person's items' ids that are to be removed.
        const othersItemsToModify: Record<string, { from: string[], to: string[] }> = getOthersItemsToModify(ownedItems.ownedItemIds)

        const promises: Promise<IItem>[] = Object.keys(othersItemsToModify).map(async othersItemId => {
            const item = await Item.findById(othersItemId)
            if (!item) throw new Error('Could not find item.')
            othersItemsToModify[othersItemId].from.forEach(idToRemove => {
                item.matchedFromIds = item.matchedFromIds.filter(itemId => itemId.toString() !== idToRemove.toString())
            })
            othersItemsToModify[othersItemId].to.forEach(idToRemove => {
                item.matchedToIds = item.matchedToIds.filter(itemId => itemId.toString() !== idToRemove.toString())
            })
            await item.save()
            return item
        })
        await Promise.all(promises)

    } catch (error) {
        console.log(error)
        return await databaseError(session, 'Error in removing MATCHES from items by other people.', authenticatedPerson)
    }

    try {
        // Completely remove all ITEMS by the person
        await Item.deleteMany({ ownerPersonId: authenticatedPerson._id })
    } catch (error) {
        console.log(error)
        return await databaseError(session, 'Error in removing ITEMS by person.', authenticatedPerson)
    }

    try {
        // Finally remove person
        await Person.findByIdAndRemove(authenticatedPerson._id)
        await session.commitTransaction()
        session.endSession()
        return {
            code: '200',
            success: true,
            message: REMOVE_PERSON_SUCCESS,
            id: authenticatedPerson._id,
            username: authenticatedPerson.username ?? undefined,
            facebookName: authenticatedPerson.facebookName ?? undefined
        }
    } catch (error) {
        console.log(error)
        return await databaseError(session, 'Error in removing PERSON.', authenticatedPerson)
    }

}