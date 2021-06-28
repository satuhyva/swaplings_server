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
exports.addPostService = void 0;
const addPostService = (authenticatedPerson, Item, Chat, addPostInput) => __awaiter(void 0, void 0, void 0, function* () {
    if (!authenticatedPerson) {
        return {
            code: '401',
            success: false,
            message: 'Not authorized to post in the chat.',
            chat: undefined
        };
    }
    const { itemIdA, itemIdB, post } = addPostInput;
    let item1, item2;
    try {
        item1 = yield Item.findById(itemIdA);
        item2 = yield Item.findById(itemIdB);
    }
    catch (error) {
        console.log(error);
    }
    if (!item1 || !item2) {
        return {
            code: '500',
            success: false,
            message: 'Could not find items in database.',
            chat: undefined
        };
    }
    try {
        const newPostToAdd = {
            post: post,
            postingItemId: authenticatedPerson._id.toString() === item1.ownerPersonId.toString() ? item1._id : item2._id,
            createdAt: Date.now()
        };
        let chat = yield Chat.findOne({ itemIdA: { $in: [itemIdA, itemIdB] }, itemIdB: { $in: [itemIdA, itemIdB] } });
        if (!chat) {
            chat = new Chat({
                itemIdA: item1._id,
                personIdA: item1.ownerPersonId,
                itemIdB: item2._id,
                personIdB: item2.ownerPersonId,
                posts: [newPostToAdd]
            });
            const createdChat = yield chat.save();
            const createdChatJSON = createdChat.toJSON();
            return {
                code: '200',
                success: true,
                message: 'Successfully started chat for this match.',
                chat: createdChatJSON
            };
        }
        else {
            chat.posts = [...chat.posts, newPostToAdd];
            const modifiedChat = yield chat.save();
            const modifiedChatJSON = modifiedChat;
            return {
                code: '200',
                success: true,
                message: 'Successfully added new post to the chat.',
                chat: modifiedChatJSON
            };
        }
    }
    catch (error) {
        console.log(error);
        return {
            code: '500',
            success: false,
            message: 'Error adding post to chat.',
            chat: undefined
        };
    }
});
exports.addPostService = addPostService;
