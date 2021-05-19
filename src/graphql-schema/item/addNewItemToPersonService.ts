import { ApolloError } from 'apollo-server-express'
import { Model } from 'mongoose'
import { IItem } from '../../mongoose-schema/item'
import { IPerson } from '../../mongoose-schema/person'
import { getItemDatabaseType } from './getItemDatabaseType'
import { AddItemInputType } from '../../types/item/AddItemInputType'
import { ItemDatabaseType } from '../../types/item/ItemDatabaseType'


export const addNewItemToPersonService = async (
    Person: Model<IPerson>, 
    Item: Model<IItem>, 
    itemInput: AddItemInputType
    ): Promise<ItemDatabaseType> => {
    
    const {  username, title, description, priceGroup } = itemInput
    const person: IPerson | null = await Person.findOne({ username: username })
    if (!person) throw new ApolloError('Could not find person to whom the item should be added.')

    const itemToAdd = new Item({ title: title, description: description, priceGroup: priceGroup, ownerPersonId: person._id })
    try {
        const savedItem: IItem = await itemToAdd.save()
        person.ownedItemIds = [...person.ownedItemIds, savedItem._id]
        await person.save()
        return getItemDatabaseType(savedItem)
    } catch (error) {
        throw new ApolloError('Could not add item to person: ', error)
    }
}