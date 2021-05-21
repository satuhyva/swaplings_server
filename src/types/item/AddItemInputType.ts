import { PriceGroupEnum } from '../price-group/PriceGroupEnum'

export type AddItemInputType = {
    title: string, 
    priceGroup: PriceGroupEnum,
    description: string,
    image_public_id?: string,
    image_secure_url?: string,
    brand?: string, 
}