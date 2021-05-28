import { Model } from 'mongoose'
import { IItem } from '../../../mongoose-schema/item'
import { IPerson } from '../../../mongoose-schema/person'
import { ItemDatabaseType } from '../../../types/item/ItemDatabaseType'
import { ApolloError } from 'apollo-server-express'
import { getItemDatabaseType } from '../helpers/getItemDatabaseType'


export const myItemsService = async (authenticatedPerson: IPerson, Item: Model<IItem>): Promise<ItemDatabaseType[]> => {

    if (!authenticatedPerson) throw new ApolloError('Not authenticated. Cannot get items.')
    try {
        const itemsByPerson = await Item.find({ ownerPersonId: authenticatedPerson._id })
        return itemsByPerson.map(item => getItemDatabaseType(item))        
    } catch (error) {
        throw new ApolloError('Error. Cannot get items.')
    }

}