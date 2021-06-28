"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOthersItemsToModify = void 0;
const getOthersItemsToModify = (ownedItemIds) => {
    const othersItemsToModify = {};
    ownedItemIds.forEach(personsItem => {
        personsItem.matchedToIds.forEach(othersFromId => {
            if (!othersItemsToModify[othersFromId.toString()]) {
                othersItemsToModify[othersFromId.toString()] = { from: [personsItem._id.toString()], to: [] };
            }
            else {
                othersItemsToModify[othersFromId.toString()] = Object.assign(Object.assign({}, othersItemsToModify[othersFromId.toString()]), { from: [...othersItemsToModify[othersFromId.toString()].from, personsItem._id.toString()] });
            }
        });
        personsItem.matchedFromIds.forEach(othersToId => {
            if (!othersItemsToModify[othersToId.toString()]) {
                othersItemsToModify[othersToId.toString()] = { from: [], to: [personsItem._id.toString()] };
            }
            else {
                othersItemsToModify[othersToId.toString()] = Object.assign(Object.assign({}, othersItemsToModify[othersToId.toString()]), { to: [...othersItemsToModify[othersToId.toString()].to, personsItem._id.toString()] });
            }
        });
    });
    return othersItemsToModify;
};
exports.getOthersItemsToModify = getOthersItemsToModify;
