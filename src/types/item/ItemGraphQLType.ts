import { PriceGroupEnum } from '../PriceGroupEnum'
import { PersonGraphQLType } from '../person/PersonGraphQLType'


export type ItemGraphQLType = {
    id: string,
    title: string,
    priceGroup: PriceGroupEnum,
    owner: PersonGraphQLType
}