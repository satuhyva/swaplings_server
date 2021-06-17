import { Model } from 'mongoose'
import { IItem } from '../../../mongoose-schema/item'
import { IPerson } from '../../../mongoose-schema/person'
import { ChangeMatchInputType } from '../../../types/item/ChangeMatchInputType'
import { ChangeMatchResponseType } from '../../../types/item/ChangeMatchResponseType'
import mongoose from 'mongoose'
// import { getItemDatabaseType } from '../helpers/getItemDatabaseType'
import { 
    ERROR_FINDING_ITEMS_IN_DATABASE, 
    ERROR_NOT_OWNER,
    ERROR_OWN_TO_ITEM
 } from '../helpers/errorMessages'
import { IChat } from '../../../mongoose-schema/chat'



export const removeMatchService = async (
    authenticatedPerson: IPerson,
    Item: Model<IItem>, 
    Chat: Model<IChat> ,
    removeMatchInput: ChangeMatchInputType
    ): Promise<ChangeMatchResponseType> => {
    
        if (!authenticatedPerson) {
            return {
                code: '401',
                success: false,
                message: 'Not authorized to remove match.',
                myItem: undefined
            }
        }

        // TODO: muuta virheviestit järkevämmiksi

        const { myItemId, itemToId } = removeMatchInput

        const myDatabaseItem = await Item.findById(myItemId)
        const toDatabaseItem = await Item.findById(itemToId)
        if (!myDatabaseItem || !toDatabaseItem) {
            return {
                code: '500',
                success: false,
                message: ERROR_FINDING_ITEMS_IN_DATABASE,
                myItem: undefined
            }
        }
        if (authenticatedPerson._id.toString() !== myDatabaseItem.ownerPersonId.toString()) {
            return {
                code: '401',
                success: false,
                message: ERROR_NOT_OWNER,
                myItem: undefined
            }
        }


        if (authenticatedPerson._id.toString() === toDatabaseItem.ownerPersonId.toString()) {
            return {
                code: '401',
                success: false,
                message: ERROR_OWN_TO_ITEM,
                myItem: undefined
            }
        }

        if (!toDatabaseItem.matchedFromIds.includes(myItemId) && !myDatabaseItem.matchedToIds.includes(itemToId)) {
            return {
                code: '500',
                success: false,
                message: 'Match no longer exists, so it cannot be removed.',
                myItem: undefined
            }
        } 


        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            await Chat.deleteOne({ $or: [ { itemIdA: myDatabaseItem._id, itemIdB: toDatabaseItem._id }, { itemIdA: toDatabaseItem._id, itemIdB: myDatabaseItem._id } ]})
            myDatabaseItem.matchedToIds = myDatabaseItem.matchedToIds.filter(myId => myId.toString() !== itemToId.toString())
            await myDatabaseItem.save()
            toDatabaseItem.matchedFromIds = toDatabaseItem.matchedFromIds.filter(otherId => otherId.toString() !== myItemId.toString())
            await toDatabaseItem.save()
            await session.commitTransaction()
            session.endSession()
            return {
                code: '200',
                success: true,
                message: 'Succesfully removed match.',
                myItem: myDatabaseItem.toDatabaseItem()     // getItemDatabaseType(myDatabaseItem)
            }
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            return {
                code: '500',
                success: false,
                message: 'Error removing match.',
                myItem: undefined
            }
        }
}
