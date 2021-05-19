import { PriceGroupEnum } from '../price-group/PriceGroupEnum'

export type AddItemInputType = {
    username: string, 
    title: string, 
    priceGroup: PriceGroupEnum,
    description: string
}