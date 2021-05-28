import { PriceGroupEnum } from '../price-group/PriceGroupEnum'


export type ItemDatabaseType = {
    id: string,
    title: string,
    description: string,
    priceGroup: PriceGroupEnum,
    ownerPersonId: string,
    matchedToIds: string[],
    matchedFromIds: string[],
    imagePublicId?: string,
    imageSecureUrl?: string,
    brand?: string, 
}
