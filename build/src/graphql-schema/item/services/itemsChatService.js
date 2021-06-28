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
exports.itemsChatService = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const itemsChatService = (authenticatedPerson, Item, Chat, itemsChatInput) => __awaiter(void 0, void 0, void 0, function* () {
    if (!authenticatedPerson)
        throw new apollo_server_express_1.ApolloError('Not authenticated!');
    const { itemIdA, itemIdB } = itemsChatInput;
    let itemA, itemB;
    try {
        itemA = yield Item.findById(itemIdA);
        itemB = yield Item.findById(itemIdB);
    }
    catch (error) {
        console.log(error);
    }
    if (!itemA || !itemB)
        throw new apollo_server_express_1.ApolloError('Could not find items in database!');
    try {
        const chat = yield Chat
            .findOne({ $or: [{ itemIdA: itemIdA, itemIdB: itemIdB }, { itemIdA: itemIdB, itemIdB: itemIdA }] })
            .sort({ createdAt: 'asc' });
        return {
            id: chat === null ? undefined : chat._id,
            itemIdA: itemIdA,
            itemIdB: itemIdB,
            posts: chat === null ? [] : chat.posts
        };
    }
    catch (error) {
        console.log(error);
        throw new apollo_server_express_1.ApolloError('Error finding chat in database.');
    }
});
exports.itemsChatService = itemsChatService;
