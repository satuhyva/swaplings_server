import { Model } from 'mongoose'
import { IItem } from '../../../mongoose-schema/item'
import { getItemDatabaseType } from '../../item/helpers/getItemDatabaseType'
import { ApolloError } from 'apollo-server-express'
import { ItemDatabaseType } from '../../../types/item/ItemDatabaseType'
import { IPerson } from '../../../mongoose-schema/person'




export const ownedItemsService = async (authenticatedPerson: IPerson, personId: string, Item: Model<IItem>): Promise<null | ItemDatabaseType[]> => {

    if (!authenticatedPerson || authenticatedPerson._id.toString() !== personId.toString()) return null

    let itemsByAuthenticatedPerson: IItem[]
    try {
        itemsByAuthenticatedPerson = await Item.find({ ownerPersonId: personId })
    } catch (error) {
        throw new ApolloError('Error in getting items owned by person:')
    }

    return itemsByAuthenticatedPerson.map(item => getItemDatabaseType(item))

}