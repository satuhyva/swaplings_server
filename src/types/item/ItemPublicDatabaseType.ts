import { PriceGroupEnum } from '../price-group/PriceGroupEnum'


export type ItemPublicDatabaseType = {
    id: string,
    title: string,
    description: string,
    priceGroup: PriceGroupEnum,
    image_public_id?: string,
    image_secure_url?: string,
}
