
import { Model } from 'mongoose'
import { IItem } from '../../../mongoose-schema/item'
import { ItemPublicType } from '../../../types/item/ItemPublicType'
import { getItemPublicType } from '../helpers/getItemPublicType'


export const matchedToOrFromService = async (matchedToOrFromIds: string[], Item: Model<IItem>): Promise<ItemPublicType[]> => {

    const items = await Item.find({ _id: { $in: matchedToOrFromIds } })
    return items.map(item => getItemPublicType(item))

}

