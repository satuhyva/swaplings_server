import { PriceGroupEnum } from '../price-group/PriceGroupEnum'


export type ItemPublicType = {
    id: string,
    title: string,
    description: string,
    priceGroup: PriceGroupEnum,
    brand?: string, 
    imagePublicId?: string,
    imageSecureUrl?: string,
}
