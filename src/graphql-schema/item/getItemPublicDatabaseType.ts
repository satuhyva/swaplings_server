import { IItem } from '../../mongoose-schema/item'
import { ItemPublicDatabaseType } from '../../types/item/ItemPublicDatabaseType'



export const getItemPublicDatabaseType = (itemToConvert: IItem): ItemPublicDatabaseType => {
    return {
        id: itemToConvert._id, 
        title: itemToConvert.title, 
        description: itemToConvert.description, 
        priceGroup: itemToConvert.priceGroup, 
        image_public_id: itemToConvert.image_public_id,
        image_secure_url: itemToConvert.image_secure_url
    }
}