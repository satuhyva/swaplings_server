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
exports.myItemsService = void 0;
const apollo_server_express_1 = require("apollo-server-express");
// import { getItemDatabaseType } from '../helpers/getItemDatabaseType'
const myItemsService = (authenticatedPerson, Item) => __awaiter(void 0, void 0, void 0, function* () {
    if (!authenticatedPerson)
        throw new apollo_server_express_1.ApolloError('Not authenticated. Cannot get items.');
    try {
        const itemsByPerson = yield Item.find({ ownerPersonId: authenticatedPerson._id });
        return itemsByPerson.map(item => item.toDatabaseItem()); //getItemDatabaseType(item))        
    }
    catch (error) {
        throw new apollo_server_express_1.ApolloError('Error. Cannot get items.');
    }
});
exports.myItemsService = myItemsService;
