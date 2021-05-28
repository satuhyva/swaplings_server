import { PriceGroupEnum } from '../price-group/PriceGroupEnum'


export type BrowseItemsInputType = {
    priceGroups?: PriceGroupEnum[],
    phrasesInTitle?: string[],
    phrasesInDescription?: string[],
    brands?: string[],
}