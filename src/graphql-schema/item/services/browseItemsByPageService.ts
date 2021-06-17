import { Model } from 'mongoose'
import { IItem } from '../../../mongoose-schema/item'
import { IPerson } from '../../../mongoose-schema/person'
// import { getItemPublicType } from '../helpers/getItemPublicType'
import { NOT_AUTHORIZED_TO_GET_BROWSE_ITEMS, ERROR_GETTING_ITEMS } from '../helpers/errorMessages'
import { ApolloError } from 'apollo-server-express'
import { getBrowseSearchCriteria } from '../helpers/getBrowseSearchCriteria'
import { BrowseItemsByPageInputType, BrowseItemsByPageResponseType } from '../../../types/item/BrowseItemsByPageResponseType'


const NUMBER_OF_SHOW_FIRST_ITEMS_DEFAULT = 10


export const browseItemsByPageService = async (
    authenticatedPerson: IPerson,
    Item: Model<IItem>, 
    browseItemsByPageInput: BrowseItemsByPageInputType
    ): Promise<BrowseItemsByPageResponseType> => {
    
        if (!authenticatedPerson) {
            throw new ApolloError(NOT_AUTHORIZED_TO_GET_BROWSE_ITEMS)
        }

        const { first = NUMBER_OF_SHOW_FIRST_ITEMS_DEFAULT, after, browseItemsInput } = browseItemsByPageInput

        let createdBefore = undefined
        if (after) {
            const afterItem = await Item.findById(after)
            if (!afterItem) throw new ApolloError('Could not find the after item functioning as the cursor.')
            createdBefore = afterItem.createdAt
        }

        const searchCriteria = getBrowseSearchCriteria(browseItemsInput, authenticatedPerson._id, createdBefore)

        // after on nyt viimeisimmän esitetyn sivun viimeisin esitetty node (item)
        // nyt haetaan itemeja niin, että ensin näytetään uusimmat
        // eli jos on olemassa after (joka tarkoittaa, että tulee page'illa after tietty item)
        // niin itse asiassa haetaan itemeja, jotka on luotu ENNEN afteria ajallisesti

        // haetaan aina yksi enemmän kuin palautetaan, niin tiedetään, onko vielä, mitä hakea myöhemminlisää?
        try {
            const items = await Item
                .find(searchCriteria)
                .sort({ createdAt: -1 })
                .limit(first + 1)

            if (items.length === 0) {
                return {
                    edges: [],
                    pageInfo: {
                        endCursor: undefined,
                        hasNextPage: false
                    }
                }
            }

            const itemsToReturn = items.length > first ? items.slice(0, first) : items

            return {
                edges: itemsToReturn.map(item => {
                        return {
                            cursor: item._id,
                            node: item.toPublicItem()   //getItemPublicType(item)
                        }
                    }),
                pageInfo: {
                    endCursor: itemsToReturn[itemsToReturn.length - 1]._id,
                    hasNextPage: items.length > first
                }

            }

        } catch (error) {
            throw new ApolloError(ERROR_GETTING_ITEMS)
        }
}
