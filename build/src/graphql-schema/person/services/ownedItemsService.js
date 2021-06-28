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
exports.ownedItemsService = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const ownedItemsService = (authenticatedPerson, personId, Item) => __awaiter(void 0, void 0, void 0, function* () {
    if (!authenticatedPerson || authenticatedPerson._id.toString() !== personId.toString())
        return null;
    let itemsByAuthenticatedPerson;
    try {
        itemsByAuthenticatedPerson = yield Item.find({ ownerPersonId: personId });
    }
    catch (error) {
        throw new apollo_server_express_1.ApolloError('Error in getting items owned by person:');
    }
    return itemsByAuthenticatedPerson.map(item => item.toDatabaseItem());
});
exports.ownedItemsService = ownedItemsService;
