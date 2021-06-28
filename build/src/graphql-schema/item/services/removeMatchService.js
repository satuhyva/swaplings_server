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
exports.removeMatchService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// import { getItemDatabaseType } from '../helpers/getItemDatabaseType'
const errorMessages_1 = require("../helpers/errorMessages");
const removeMatchService = (authenticatedPerson, Item, Chat, removeMatchInput) => __awaiter(void 0, void 0, void 0, function* () {
    if (!authenticatedPerson) {
        return {
            code: '401',
            success: false,
            message: 'Not authorized to remove match.',
            myItem: undefined
        };
    }
    // TODO: muuta virheviestit järkevämmiksi
    const { myItemId, itemToId } = removeMatchInput;
    const myDatabaseItem = yield Item.findById(myItemId);
    const toDatabaseItem = yield Item.findById(itemToId);
    if (!myDatabaseItem || !toDatabaseItem) {
        return {
            code: '500',
            success: false,
            message: errorMessages_1.ERROR_FINDING_ITEMS_IN_DATABASE,
            myItem: undefined
        };
    }
    if (authenticatedPerson._id.toString() !== myDatabaseItem.ownerPersonId.toString()) {
        return {
            code: '401',
            success: false,
            message: errorMessages_1.ERROR_NOT_OWNER,
            myItem: undefined
        };
    }
    if (authenticatedPerson._id.toString() === toDatabaseItem.ownerPersonId.toString()) {
        return {
            code: '401',
            success: false,
            message: errorMessages_1.ERROR_OWN_TO_ITEM,
            myItem: undefined
        };
    }
    if (!toDatabaseItem.matchedFromIds.includes(myItemId) && !myDatabaseItem.matchedToIds.includes(itemToId)) {
        return {
            code: '500',
            success: false,
            message: 'Match no longer exists, so it cannot be removed.',
            myItem: undefined
        };
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        yield Chat.deleteOne({ $or: [{ itemIdA: myDatabaseItem._id, itemIdB: toDatabaseItem._id }, { itemIdA: toDatabaseItem._id, itemIdB: myDatabaseItem._id }] });
        myDatabaseItem.matchedToIds = myDatabaseItem.matchedToIds.filter(myId => myId.toString() !== itemToId.toString());
        yield myDatabaseItem.save();
        toDatabaseItem.matchedFromIds = toDatabaseItem.matchedFromIds.filter(otherId => otherId.toString() !== myItemId.toString());
        yield toDatabaseItem.save();
        yield session.commitTransaction();
        session.endSession();
        return {
            code: '200',
            success: true,
            message: 'Succesfully removed match.',
            myItem: myDatabaseItem.toDatabaseItem() // getItemDatabaseType(myDatabaseItem)
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        return {
            code: '500',
            success: false,
            message: 'Error removing match.',
            myItem: undefined
        };
    }
});
exports.removeMatchService = removeMatchService;
