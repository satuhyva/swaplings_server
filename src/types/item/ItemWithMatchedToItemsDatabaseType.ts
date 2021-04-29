import { PriceGroupEnum } from '../price-group/PriceGroupEnum'
// import { ItemDatabaseType } from './ItemDatabaseType'
import { IItem } from '../../mongoose-schema/item'


export type ItemWithMatchedToItemsDatabaseType = {
    title: string,
    description: string,
    priceGroup: PriceGroupEnum,
    ownerPersonId: string,
    matchedToIds: IItem[],
    matchedFromIds: string[],
}
