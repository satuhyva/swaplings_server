import { PriceGroupEnum } from '../price-group/PriceGroupEnum'

export type AddItemInputType = {
    title: string, 
    priceGroup: PriceGroupEnum,
    description: string,
    imagePublicId?: string,
    imageSecureUrl?: string,
    brand?: string, 
}