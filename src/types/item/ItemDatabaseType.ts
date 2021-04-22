import { PriceGroupEnum } from '../PriceGroupEnum'


export type ItemDatabaseType = {
    id: string,
    title: string,
    priceGroup: PriceGroupEnum,
    ownerID: string
}