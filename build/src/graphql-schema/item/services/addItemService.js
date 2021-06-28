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
exports.addItemService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// import { getItemDatabaseType } from '../helpers/getItemDatabaseType'
const errorMessages_1 = require("../helpers/errorMessages");
const addItemService = (authenticatedPerson, Person, Item, itemInput) => __awaiter(void 0, void 0, void 0, function* () {
    if (!authenticatedPerson) {
        return {
            code: '401',
            success: false,
            message: errorMessages_1.NOT_AUTHORIZED_TO_ADD_ITEM,
            item: undefined
        };
    }
    const personId = authenticatedPerson._id;
    const { title, priceGroup, description, imagePublicId, imageSecureUrl, brand } = itemInput;
    let itemData = { title: title, priceGroup: priceGroup, description: description };
    if (imagePublicId)
        itemData = Object.assign(Object.assign({}, itemData), { imagePublicId: imagePublicId });
    if (imageSecureUrl)
        itemData = Object.assign(Object.assign({}, itemData), { imageSecureUrl: imageSecureUrl });
    if (brand)
        itemData = Object.assign(Object.assign({}, itemData), { brand: brand });
    const newItem = new Item(Object.assign(Object.assign({}, itemData), { ownerPersonId: personId }));
    let savedItem;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const person = yield Person.findById(personId);
        if (!person)
            throw new Error(errorMessages_1.OWNER_NOT_FOUND_IN_DATABASE);
        savedItem = yield newItem.save();
        if (!savedItem)
            throw new Error(errorMessages_1.ERROR_SAVING_ITEM_TO_DATABASE);
        person.ownedItemIds = [...person.ownedItemIds, savedItem._id];
        yield person.save();
        yield session.commitTransaction();
        session.endSession();
        return {
            code: '200',
            success: true,
            message: errorMessages_1.SUCCESS_ADD_ITEM,
            item: savedItem.toDatabaseItem() //getItemDatabaseType(savedItem)
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        const message = error.message;
        return {
            code: '500',
            success: false,
            message: message !== null && message !== void 0 ? message : errorMessages_1.ERROR_ADDING_ITEM,
            item: undefined
        };
    }
});
exports.addItemService = addItemService;
