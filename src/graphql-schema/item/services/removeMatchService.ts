import { Model } from 'mongoose'
import { IItem } from '../../../mongoose-schema/item'
import { IPerson } from '../../../mongoose-schema/person'
import { ChangeMatchInputType } from '../../../types/item/ChangeMatchInputType'
import { ChangeMatchResponseType } from '../../../types/item/ChangeMatchResponseType'
import mongoose from 'mongoose'
import { getItemDatabaseType } from '../helpers/getItemDatabaseType'
import { 
    ERROR_FINDING_ITEMS_IN_DATABASE, 
    ERROR_NOT_OWNER,
    ERROR_OWN_TO_ITEM
 } from '../helpers/errorMessages'



export const removeMatchService = async (
    authenticatedPerson: IPerson,
    Item: Model<IItem>, 
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
        // console.log(myDatabaseItem, '\n', toDatabaseItem)
        // console.log(toDatabaseItem.matchedFromIds, toDatabaseItem.matchedFromIds.includes(myItemId))
        // console.log(myDatabaseItem.matchedToIds, myDatabaseItem.matchedToIds.includes(itemToId))

        if (!toDatabaseItem.matchedFromIds.includes(myItemId) && !myDatabaseItem.matchedToIds.includes(itemToId)) {
            return {
                code: '500',
                success: false,
                message: 'Match no longer exists, so it cannot be removed.',
                myItem: undefined
            }
        } 

        // TODO: poista myös itemien tulevat keskustelut, kun ne on toteutettu
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            console.log(myDatabaseItem.matchedToIds)
            myDatabaseItem.matchedToIds = myDatabaseItem.matchedToIds.filter(myId => myId.toString() !== itemToId.toString())
            console.log(myDatabaseItem.matchedToIds)
            await myDatabaseItem.save()
            toDatabaseItem.matchedFromIds = toDatabaseItem.matchedFromIds.filter(otherId => otherId.toString() !== myItemId.toString())
            await toDatabaseItem.save()
            await session.commitTransaction()
            session.endSession()
            return {
                code: '200',
                success: true,
                message: 'Succesfully removed match.',
                myItem: getItemDatabaseType(myDatabaseItem)
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
