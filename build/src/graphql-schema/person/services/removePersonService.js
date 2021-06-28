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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePersonService = void 0;
const errorMessages_1 = require("../helpers/errorMessages");
const mongoose_1 = __importDefault(require("mongoose"));
const removePersonDatabaseError_1 = require("./removePersonDatabaseError");
const getOthersItemsToModify_1 = require("./getOthersItemsToModify");
const removePersonService = (authenticatedPerson, Person, Item, Chat) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!authenticatedPerson) {
        return {
            code: '401',
            success: false,
            message: errorMessages_1.REMOVE_PERSON_UNAUTHORIZED,
            id: undefined,
            username: undefined,
            facebookName: undefined
        };
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Completele remove all CHATS where the person is involved
        yield Chat.deleteMany({ $or: [{ personIdA: authenticatedPerson._id }, { personIdB: authenticatedPerson._id }] });
    }
    catch (error) {
        console.log(error);
        return yield removePersonDatabaseError_1.databaseError(session, 'Error removing CHAT.', authenticatedPerson);
    }
    try {
        // Completely remove all MATCHES (other person's items, that have been matched to or from the person's items)
        const person = yield Person.findById(authenticatedPerson._id).populate('ownedItemIds');
        if (!person)
            throw new Error('Could not find person!');
        const ownedItems = person;
        // Because of the "optimisticConcurrency: true" -setting, we cannot perform simultaneously updating
        // for single items (in one thread to modify matchedTo list, and in another thread modify matchedFrom list of the same item). 
        // Perhaps it is best to modify each item's matchedTo and matchedFrom fields at one go.
        // In the below dictionary the key is the id of the target item (by other person) and lists are person's items' ids that are to be removed.
        const othersItemsToModify = getOthersItemsToModify_1.getOthersItemsToModify(ownedItems.ownedItemIds);
        const promises = Object.keys(othersItemsToModify).map((othersItemId) => __awaiter(void 0, void 0, void 0, function* () {
            const item = yield Item.findById(othersItemId);
            if (!item)
                throw new Error('Could not find item.');
            othersItemsToModify[othersItemId].from.forEach(idToRemove => {
                item.matchedFromIds = item.matchedFromIds.filter(itemId => itemId.toString() !== idToRemove.toString());
            });
            othersItemsToModify[othersItemId].to.forEach(idToRemove => {
                item.matchedToIds = item.matchedToIds.filter(itemId => itemId.toString() !== idToRemove.toString());
            });
            yield item.save();
            return item;
        }));
        yield Promise.all(promises);
    }
    catch (error) {
        console.log(error);
        return yield removePersonDatabaseError_1.databaseError(session, 'Error in removing MATCHES from items by other people.', authenticatedPerson);
    }
    try {
        // Completely remove all ITEMS by the person
        yield Item.deleteMany({ ownerPersonId: authenticatedPerson._id });
    }
    catch (error) {
        console.log(error);
        return yield removePersonDatabaseError_1.databaseError(session, 'Error in removing ITEMS by person.', authenticatedPerson);
    }
    try {
        // Finally remove person
        yield Person.findByIdAndRemove(authenticatedPerson._id);
        yield session.commitTransaction();
        session.endSession();
        return {
            code: '200',
            success: true,
            message: errorMessages_1.REMOVE_PERSON_SUCCESS,
            id: authenticatedPerson._id,
            username: (_a = authenticatedPerson.username) !== null && _a !== void 0 ? _a : undefined,
            facebookName: (_b = authenticatedPerson.facebookName) !== null && _b !== void 0 ? _b : undefined
        };
    }
    catch (error) {
        console.log(error);
        return yield removePersonDatabaseError_1.databaseError(session, 'Error in removing PERSON.', authenticatedPerson);
    }
});
exports.removePersonService = removePersonService;
