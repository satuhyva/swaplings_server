import { Model } from 'mongoose'
import { IItem } from '../../mongoose-schema/item'
import { getItemDatabaseType } from '../item/getItemDatabaseType'
import { ApolloError } from 'apollo-server-express'
import { ItemDatabaseType } from '../../types/item/ItemDatabaseType'


export const ownedItemsService = async (personId: string, Item: Model<IItem>): Promise<ItemDatabaseType[]> => {

    let itemsByPerson: IItem[]
    try {
        itemsByPerson = await Item.find({ ownerPersonId: personId })
    } catch (error) {
        throw new ApolloError('Error in getting items owned by person:', error)
    }
    return itemsByPerson.map(item => getItemDatabaseType(item))

}