import { Model } from 'mongoose'
import { IItem } from '../../../mongoose-schema/item'
import { IPerson } from '../../../mongoose-schema/person'
import { AddItemInputType } from '../../../types/item/AddItemInputType'
import { AddItemResponseType } from '../../../types/item/AddItemResponseType'
import mongoose from 'mongoose'
import { getItemDatabaseType } from '../helpers/getItemDatabaseType'
import { NOT_AUTHORIZED_TO_ADD_ITEM, OWNER_NOT_FOUND_IN_DATABASE, ERROR_SAVING_ITEM_TO_DATABASE, SUCCESS_ADD_ITEM, ERROR_ADDING_ITEM } from '../helpers/errorMessages'



export const addItemService = async (
    authenticatedPerson: IPerson,
    Person: Model<IPerson>, 
    Item: Model<IItem>, 
    itemInput: AddItemInputType
    ): Promise<AddItemResponseType> => {
    
        if (!authenticatedPerson) {
            return {
                code: '401',
                success: false,
                message: NOT_AUTHORIZED_TO_ADD_ITEM,
                item: undefined
            }
        }

        const personId = authenticatedPerson._id

        const { title, priceGroup, description, image_public_id, image_secure_url, brand } = itemInput
        let itemData: AddItemInputType = { title: title, priceGroup: priceGroup, description: description } 
        if (image_public_id) itemData = { ...itemData, image_public_id: image_public_id }
        if (image_secure_url) itemData = { ...itemData, image_secure_url: image_secure_url }
        if (brand) itemData = { ...itemData, brand: brand }
        const newItem = new Item({ ...itemData, ownerPersonId: personId })

        let savedItem: IItem | undefined
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const person = await Person.findById(personId)
            if (!person) throw new Error(OWNER_NOT_FOUND_IN_DATABASE)
            savedItem = await newItem.save()
            if (!savedItem) throw new Error(ERROR_SAVING_ITEM_TO_DATABASE)
            person.ownedItemIds= [...person.ownedItemIds, savedItem._id]
            await person.save()
            await session.commitTransaction()
            session.endSession()
            return {
                code: '200',
                success: true,
                message: SUCCESS_ADD_ITEM,
                item: getItemDatabaseType(savedItem)
            }
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            const message = (error as { message: string }).message
            return {
                code: '500',
                success: false,
                message: message ?? ERROR_ADDING_ITEM,
                item: undefined
            }
        }
}
