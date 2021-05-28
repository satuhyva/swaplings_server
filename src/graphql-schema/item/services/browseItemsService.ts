import { Model } from 'mongoose'
import { IItem } from '../../../mongoose-schema/item'
import { IPerson } from '../../../mongoose-schema/person'
import { BrowseItemsInputType } from '../../../types/item/BrowseItemsInputType'
import { getItemPublicType } from '../helpers/getItemPublicType'
import { NOT_AUTHORIZED_TO_GET_BROWSE_ITEMS, ERROR_GETTING_ITEMS } from '../helpers/errorMessages'
import { ApolloError } from 'apollo-server-express'
import { ItemPublicType } from '../../../types/item/ItemPublicType'
import { PriceGroupEnum } from '../../../types/price-group/PriceGroupEnum'


type SearchCriteriaType = {
    ownerPersonId: { $ne: string },
    priceGroup?: { $in: PriceGroupEnum[] },
    title?:  { $regex: RegExp },
    description?:  { $regex: RegExp },
    brand?:  { $regex: RegExp },
}


export const browseItemsService = async (
    authenticatedPerson: IPerson,
    Item: Model<IItem>, 
    browseItemsInput: BrowseItemsInputType
    ): Promise<ItemPublicType[]> => {
    
        if (!authenticatedPerson) {
            throw new ApolloError(NOT_AUTHORIZED_TO_GET_BROWSE_ITEMS)
        }

        const personId = authenticatedPerson._id
        const { priceGroups, phrasesInTitle, phrasesInDescription, brands } = browseItemsInput


        let searchCriteria: SearchCriteriaType = { ownerPersonId: { $ne: personId }}
        if (priceGroups && priceGroups.length > 0) {
            searchCriteria = { ...searchCriteria, priceGroup: { $in: priceGroups }}
        } 
        if (phrasesInTitle && phrasesInTitle.length > 0) {
            let titleRegexStringBuilder = '(?=.*('
            for (let i = 0; i < phrasesInTitle.length; i++) {
                titleRegexStringBuilder += phrasesInTitle[i]
                if (i < phrasesInTitle.length - 1) {
                    titleRegexStringBuilder += '|'
                }
            }
            titleRegexStringBuilder += '))'
            searchCriteria = { ...searchCriteria, title: { $regex: new RegExp(titleRegexStringBuilder, 'i') }}
        }
        if (phrasesInDescription && phrasesInDescription.length > 0) {
            let descriptionRegexStringBuilder = '(?=.*('
            for (let i = 0; i < phrasesInDescription.length; i++) {
                descriptionRegexStringBuilder += phrasesInDescription[i]
                if (i < phrasesInDescription.length - 1) {
                    descriptionRegexStringBuilder += '|'
                }
            }
            descriptionRegexStringBuilder += '))'
            searchCriteria = { ...searchCriteria, description: { $regex: new RegExp(descriptionRegexStringBuilder, 'i') }}
        }
        if (brands && brands.length > 0) {
            let brandsRegexStringBuilder = '(?=.*('
            for (let i = 0; i < brands.length; i++) {
                brandsRegexStringBuilder += brands[i]
                if (i < brands.length - 1) {
                    brandsRegexStringBuilder += '|'
                }
            }
            brandsRegexStringBuilder += '))'
            searchCriteria = { ...searchCriteria, brand: { $regex: new RegExp(brandsRegexStringBuilder, 'i') }}
        }

        try {
            const items = await Item.find(searchCriteria)
            return items.map(item => getItemPublicType(item))
        } catch (error) {
            throw new ApolloError(ERROR_GETTING_ITEMS)
        }
}

// (?=.*(orange|apple))