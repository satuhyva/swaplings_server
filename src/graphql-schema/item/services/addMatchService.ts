import { Model } from 'mongoose'
import { IItem } from '../../../mongoose-schema/item'
import { IPerson } from '../../../mongoose-schema/person'
import { ChangeMatchInputType } from '../../../types/item/ChangeMatchInputType'
import { ChangeMatchResponseType } from '../../../types/item/ChangeMatchResponseType'
import mongoose from 'mongoose'
// import { getItemDatabaseType } from '../helpers/getItemDatabaseType'
import { 
    NOT_AUTHORIZED_TO_ADD_MATCH, 
    ERROR_FINDING_ITEMS_IN_DATABASE, 
    ERROR_THIS_WAY_MATCH_ALREADY_EXISTS,
    SUCCESS_ADDING_MATCH,
    ERROR_ADDING_MATCH,
    ERROR_NOT_OWNER,
    ERROR_OWN_TO_ITEM
 } from '../helpers/errorMessages'



export const addMatchService = async (
    authenticatedPerson: IPerson,
    Item: Model<IItem>, 
    addMatchInput: ChangeMatchInputType
    ): Promise<ChangeMatchResponseType> => {
    
        if (!authenticatedPerson) {
            return {
                code: '401',
                success: false,
                message: NOT_AUTHORIZED_TO_ADD_MATCH,
                myItem: undefined
            }
        }

        const { myItemId, itemToId } = addMatchInput

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

        if (toDatabaseItem.matchedFromIds.includes(myItemId) || myDatabaseItem.matchedToIds.includes(itemToId)) {
            return {
                code: '500',
                success: false,
                message: ERROR_THIS_WAY_MATCH_ALREADY_EXISTS,
                myItem: undefined
            }
        } 

        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            myDatabaseItem.matchedToIds = [ ...myDatabaseItem.matchedToIds, itemToId ]
            await myDatabaseItem.save()
            toDatabaseItem.matchedFromIds = [ ...toDatabaseItem.matchedFromIds, myItemId ]
            await toDatabaseItem.save()
            await session.commitTransaction()
            session.endSession()
            return {
                code: '200',
                success: true,
                message: SUCCESS_ADDING_MATCH,
                myItem: myDatabaseItem.toDatabaseItem() // getItemDatabaseType(myDatabaseItem)
            }
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            return {
                code: '500',
                success: false,
                message: ERROR_ADDING_MATCH,
                myItem: undefined
            }
        }
}
