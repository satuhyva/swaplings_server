import { IItem } from '../../../mongoose-schema/item'
import { ItemDatabaseType } from '../../../types/item/ItemDatabaseType'



export const getItemDatabaseType = (itemToConvert: IItem): ItemDatabaseType => {
    return {
        id: itemToConvert._id, 
        title: itemToConvert.title, 
        description: itemToConvert.description, 
        priceGroup: itemToConvert.priceGroup, 
        ownerPersonId: itemToConvert.ownerPersonId,
        matchedToIds: itemToConvert.matchedToIds,
        matchedFromIds: itemToConvert.matchedFromIds,
        image_public_id: itemToConvert.image_public_id,
        image_secure_url: itemToConvert.image_secure_url,
        brand: itemToConvert.brand,
    }
}