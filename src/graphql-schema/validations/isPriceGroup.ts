import { PriceGroupEnum } from '../../types/price-group/PriceGroupEnum'

export const isPriceGroup = (priceGroup: string): boolean => {
    return  !Object.values(PriceGroupEnum).every(groupValue => groupValue !== priceGroup)
}