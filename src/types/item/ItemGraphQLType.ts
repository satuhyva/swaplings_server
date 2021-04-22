import { PriceGroupEnum } from '../PriceGroupEnum'
import { PersonType } from '../PersonType'


export type ItemGraphQLType = {
    id: string,
    title: string,
    priceGroup: PriceGroupEnum,
    ownerID: PersonType
}