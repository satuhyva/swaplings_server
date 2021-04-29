import { PriceGroupEnum } from '../price-group/PriceGroupEnum'
import { IItem } from '../../mongoose-schema/item'


export type ItemWithMatchedFromItemsDatabaseType = {
    title: string,
    description: string,
    priceGroup: PriceGroupEnum,
    ownerPersonId: string,
    matchedToIds: string[],
    matchedFromIds: IItem[],
}
