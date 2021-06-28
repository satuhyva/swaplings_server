"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.browseItemsByPageService = void 0;
// import { getItemPublicType } from '../helpers/getItemPublicType'
const errorMessages_1 = require("../helpers/errorMessages");
const apollo_server_express_1 = require("apollo-server-express");
const getBrowseSearchCriteria_1 = require("../helpers/getBrowseSearchCriteria");
const NUMBER_OF_SHOW_FIRST_ITEMS_DEFAULT = 10;
const browseItemsByPageService = (authenticatedPerson, Item, browseItemsByPageInput) => __awaiter(void 0, void 0, void 0, function* () {
    if (!authenticatedPerson) {
        throw new apollo_server_express_1.ApolloError(errorMessages_1.NOT_AUTHORIZED_TO_GET_BROWSE_ITEMS);
    }
    const { first = NUMBER_OF_SHOW_FIRST_ITEMS_DEFAULT, after, browseItemsInput } = browseItemsByPageInput;
    let createdBefore = undefined;
    if (after) {
        const afterItem = yield Item.findById(after);
        if (!afterItem)
            throw new apollo_server_express_1.ApolloError('Could not find the after item functioning as the cursor.');
        createdBefore = afterItem.createdAt;
    }
    const searchCriteria = getBrowseSearchCriteria_1.getBrowseSearchCriteria(browseItemsInput, authenticatedPerson._id, createdBefore);
    // after on nyt viimeisimmän esitetyn sivun viimeisin esitetty node (item)
    // nyt haetaan itemeja niin, että ensin näytetään uusimmat
    // eli jos on olemassa after (joka tarkoittaa, että tulee page'illa after tietty item)
    // niin itse asiassa haetaan itemeja, jotka on luotu ENNEN afteria ajallisesti
    // haetaan aina yksi enemmän kuin palautetaan, niin tiedetään, onko vielä, mitä hakea myöhemminlisää?
    try {
        const items = yield Item
            .find(searchCriteria)
            .sort({ createdAt: -1 })
            .limit(first + 1);
        if (items.length === 0) {
            return {
                edges: [],
                pageInfo: {
                    endCursor: undefined,
                    hasNextPage: false
                }
            };
        }
        const itemsToReturn = items.length > first ? items.slice(0, first) : items;
        return {
            edges: itemsToReturn.map(item => {
                return {
                    cursor: item._id,
                    node: item.toPublicItem() //getItemPublicType(item)
                };
            }),
            pageInfo: {
                endCursor: itemsToReturn[itemsToReturn.length - 1]._id,
                hasNextPage: items.length > first
            }
        };
    }
    catch (error) {
        throw new apollo_server_express_1.ApolloError(errorMessages_1.ERROR_GETTING_ITEMS);
    }
});
exports.browseItemsByPageService = browseItemsByPageService;
