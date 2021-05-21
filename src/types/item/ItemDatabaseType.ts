import { PriceGroupEnum } from '../price-group/PriceGroupEnum'


export type ItemDatabaseType = {
    id: string,
    title: string,
    description: string,
    priceGroup: PriceGroupEnum,
    ownerPersonId: string,
    matchedToIds: string[],
    matchedFromIds: string[],
    image_public_id?: string,
    image_secure_url?: string,
    brand?: string, 
}
