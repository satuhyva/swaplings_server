"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrowseSearchCriteria = void 0;
const getBrowseSearchCriteria = (browseItemsInput, personId, createdBefore) => {
    const { priceGroups, phrasesInTitle, phrasesInDescription, brands } = browseItemsInput;
    let searchCriteria = { ownerPersonId: { $ne: personId } };
    if (priceGroups && priceGroups.length > 0) {
        searchCriteria = Object.assign(Object.assign({}, searchCriteria), { priceGroup: { $in: priceGroups } });
    }
    if (phrasesInTitle && phrasesInTitle.length > 0) {
        searchCriteria = Object.assign(Object.assign({}, searchCriteria), { title: getRegexCondition(phrasesInTitle) });
    }
    if (phrasesInDescription && phrasesInDescription.length > 0) {
        searchCriteria = Object.assign(Object.assign({}, searchCriteria), { description: getRegexCondition(phrasesInDescription) });
    }
    if (brands && brands.length > 0) {
        searchCriteria = Object.assign(Object.assign({}, searchCriteria), { brand: getRegexCondition(brands) });
    }
    if (createdBefore) {
        searchCriteria = Object.assign(Object.assign({}, searchCriteria), { createdAt: { $lt: createdBefore } });
    }
    return searchCriteria;
};
exports.getBrowseSearchCriteria = getBrowseSearchCriteria;
const getRegexCondition = (wordsList) => {
    let titleRegexStringBuilder = '(?=.*(';
    for (let i = 0; i < wordsList.length; i++) {
        titleRegexStringBuilder += wordsList[i];
        if (i < wordsList.length - 1) {
            titleRegexStringBuilder += '|';
        }
    }
    titleRegexStringBuilder += '))';
    return { $regex: new RegExp(titleRegexStringBuilder, 'i') };
};
