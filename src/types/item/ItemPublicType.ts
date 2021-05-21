import { PriceGroupEnum } from '../price-group/PriceGroupEnum'


export type ItemPublicType = {
    id: string,
    title: string,
    description: string,
    priceGroup: PriceGroupEnum,
    brand?: string, 
    image_public_id?: string,
    image_secure_url?: string,
}
