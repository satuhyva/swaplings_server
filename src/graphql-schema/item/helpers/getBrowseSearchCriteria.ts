import { BrowseItemsInputType } from '../../../types/item/BrowseItemsInputType'
import { PriceGroupEnum } from '../../../types/price-group/PriceGroupEnum'



type SearchCriteriaType = {
    ownerPersonId: { $ne: string },
    priceGroup?: { $in: PriceGroupEnum[] },
    title?:  { $regex: RegExp },
    description?:  { $regex: RegExp },
    brand?:  { $regex: RegExp },
    createdAt?: { $lt: number }
}



export const getBrowseSearchCriteria = (browseItemsInput: BrowseItemsInputType, personId: string, createdBefore?: number): SearchCriteriaType => {

    const { priceGroups, phrasesInTitle, phrasesInDescription, brands } = browseItemsInput

        let searchCriteria: SearchCriteriaType = { ownerPersonId: { $ne: personId }}

        if (priceGroups && priceGroups.length > 0) {
            searchCriteria = { ...searchCriteria, priceGroup: { $in: priceGroups }}
        } 

        if (phrasesInTitle && phrasesInTitle.length > 0) {
            searchCriteria = { ...searchCriteria, title: getRegexCondition(phrasesInTitle)}
        }

        if (phrasesInDescription && phrasesInDescription.length > 0) {
            searchCriteria = { ...searchCriteria, description: getRegexCondition(phrasesInDescription)}
        }

        if (brands && brands.length > 0) {
            searchCriteria = { ...searchCriteria, brand: getRegexCondition(brands)}
        }

        if (createdBefore) {
            searchCriteria = { ...searchCriteria, createdAt: { $lt: createdBefore } }
        }

        return searchCriteria

}


const getRegexCondition = (wordsList: string[]) => {
    let titleRegexStringBuilder = '(?=.*('
    for (let i = 0; i < wordsList.length; i++) {
        titleRegexStringBuilder += wordsList[i]
        if (i < wordsList.length - 1) {
            titleRegexStringBuilder += '|'
        }
    }
    titleRegexStringBuilder += '))'
    return { $regex: new RegExp(titleRegexStringBuilder, 'i') }
}



// if (brands && brands.length > 0) {
//     let brandsRegexStringBuilder = '(?=.*('
//     for (let i = 0; i < brands.length; i++) {
//         brandsRegexStringBuilder += brands[i]
//         if (i < brands.length - 1) {
//             brandsRegexStringBuilder += '|'
//         }
//     }
//     brandsRegexStringBuilder += '))'
//     searchCriteria = { ...searchCriteria, brand: { $regex: new RegExp(brandsRegexStringBuilder, 'i') }}
// }

