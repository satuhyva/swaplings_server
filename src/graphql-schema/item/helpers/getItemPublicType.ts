
import { ItemPublicType } from '../../../types/item/ItemPublicType'
import { IItem } from '../../../mongoose-schema/item'



export const getItemPublicType = (itemToConvert: IItem): ItemPublicType => {
    return {
        id: itemToConvert._id, 
        title: itemToConvert.title, 
        description: itemToConvert.description, 
        priceGroup: itemToConvert.priceGroup, 
        image_public_id: itemToConvert.image_public_id,
        image_secure_url: itemToConvert.image_secure_url,
        brand: itemToConvert.brand,
    }
}