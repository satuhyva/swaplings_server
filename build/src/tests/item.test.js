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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const queries_1 = require("./queries");
const index_1 = require("../../index");
const mongoose_1 = __importDefault(require("mongoose"));
const clearTestDatabase_1 = require("./clearTestDatabase");
const errorMessages_1 = require("../graphql-schema/item/helpers/errorMessages");
const person_1 = __importDefault(require("../mongoose-schema/person"));
const constants_1 = require("./constants");
const index_2 = require("../../index");
const helperFunctions_1 = require("./helperFunctions");
const testServer = supertest_1.default(app_1.default);
describe('ITEM', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield index_1.connectToMongooseDatabase();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield clearTestDatabase_1.clearTestDatabase();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
        index_2.stopServer();
    }));
    test('given valid item details, an item can be added to a logged in person', () => __awaiter(void 0, void 0, void 0, function* () {
        const addedItemResponse = yield helperFunctions_1.addPersonAndAnItemToPerson(testServer, constants_1.USERNAME, constants_1.PASSWORD, constants_1.PASSWORDHASH, constants_1.TITLE, constants_1.PRICE_GROUP, constants_1.DESCRIPTION, constants_1.BRAND, constants_1.IMAGE_PUBLIC_ID, constants_1.IMAGE_SECURE_URL);
        const addedItem = addedItemResponse.data.addItem;
        expect(addedItem.code).toBe('200');
        expect(addedItem.success).toBe(true);
        expect(addedItem.message).toBe(errorMessages_1.SUCCESS_ADD_ITEM);
        expect(addedItem.item.id).toBeDefined();
        expect(addedItem.item.title).toBe(constants_1.TITLE);
        expect(addedItem.item.description).toBe(constants_1.DESCRIPTION);
        expect(addedItem.item.priceGroup).toBe(constants_1.PRICE_GROUP);
        expect(addedItem.item.owner.id).toBeDefined();
        expect(addedItem.item.matchedTo.length).toBe(0);
        expect(addedItem.item.matchedFrom.length).toBe(0);
        expect(addedItem.item.imagePublicId).toBe(constants_1.IMAGE_PUBLIC_ID);
        expect(addedItem.item.imageSecureUrl).toBe(constants_1.IMAGE_SECURE_URL);
        expect(addedItem.item.brand).toBe(constants_1.BRAND);
        const person = yield person_1.default.findOne({ username: constants_1.USERNAME });
        expect(person.username).toBe(constants_1.USERNAME);
    }));
    test('given an app user, the user can get his or her (and only his or her) items', () => __awaiter(void 0, void 0, void 0, function* () {
        yield helperFunctions_1.addPersonAndAnItemToPerson(testServer, constants_1.USERNAME + '_1', constants_1.PASSWORD, constants_1.PASSWORDHASH, constants_1.TITLE + '_1', constants_1.PRICE_GROUP, constants_1.DESCRIPTION, constants_1.BRAND, constants_1.IMAGE_PUBLIC_ID, constants_1.IMAGE_SECURE_URL);
        yield helperFunctions_1.addPersonAndAnItemToPerson(testServer, constants_1.USERNAME + '_2', constants_1.PASSWORD, constants_1.PASSWORDHASH, constants_1.TITLE + '_2A', constants_1.PRICE_GROUP, constants_1.DESCRIPTION, constants_1.BRAND, constants_1.IMAGE_PUBLIC_ID, constants_1.IMAGE_SECURE_URL);
        yield helperFunctions_1.addPersonAndAnItemToPerson(testServer, constants_1.USERNAME + '_2', constants_1.PASSWORD, constants_1.PASSWORDHASH, constants_1.TITLE + '_2B', constants_1.PRICE_GROUP, constants_1.DESCRIPTION, constants_1.BRAND, constants_1.IMAGE_PUBLIC_ID, constants_1.IMAGE_SECURE_URL);
        const queryLogin = queries_1.loginPersonQuery(constants_1.USERNAME + '_2', constants_1.PASSWORD);
        const responseLogin = yield queries_1.performTestServerQuery(testServer, queryLogin);
        const loggedInPerson = responseLogin.body.data.loginPerson;
        const token = loggedInPerson.jwtToken;
        if (!token)
            throw new Error('Token is required but it is missing.');
        const queryMyItems = queries_1.myItemsQuery();
        const responseMyItems = yield queries_1.performAuthorizedTestServerQuery(testServer, queryMyItems, token);
        const myItems = responseMyItems.body.data.myItems;
        expect(myItems.length).toBe(2);
        expect(myItems[0].title).toBe(constants_1.TITLE + '_2A');
        expect(myItems[1].title).toBe(constants_1.TITLE + '_2B');
    }));
    test('given a matched pair of items, posts can be added to a chat for this match', () => __awaiter(void 0, void 0, void 0, function* () {
        const user_1 = constants_1.USERNAME + '_1';
        const user_2 = constants_1.USERNAME + '_2';
        const addedItem1Response = yield helperFunctions_1.addPersonAndAnItemToPerson(testServer, user_1, constants_1.PASSWORD, constants_1.PASSWORDHASH, constants_1.TITLE + '_1', constants_1.PRICE_GROUP, constants_1.DESCRIPTION, constants_1.BRAND, constants_1.IMAGE_PUBLIC_ID, constants_1.IMAGE_SECURE_URL);
        const addedItem1Id = addedItem1Response.data.addItem.item.id;
        const addedItem2Response = yield helperFunctions_1.addPersonAndAnItemToPerson(testServer, user_2, constants_1.PASSWORD, constants_1.PASSWORDHASH, constants_1.TITLE + '_2', constants_1.PRICE_GROUP, constants_1.DESCRIPTION, constants_1.BRAND, constants_1.IMAGE_PUBLIC_ID, constants_1.IMAGE_SECURE_URL);
        const addedItem2Id = addedItem2Response.data.addItem.item.id;
        const post1Result = yield helperFunctions_1.addPostToItemsChat(testServer, addedItem1Id, addedItem2Id, constants_1.POST + ' by _1', user_1, constants_1.PASSWORD);
        const chat_first = post1Result.data.addPost.chat;
        expect(chat_first.posts.length).toBe(1);
        const post2Result = yield helperFunctions_1.addPostToItemsChat(testServer, addedItem1Id, addedItem2Id, constants_1.POST + ' by _1', user_1, constants_1.PASSWORD);
        const chat_second = post2Result.data.addPost.chat;
        expect(chat_second.posts.length).toBe(2);
        const post3Result = yield helperFunctions_1.addPostToItemsChat(testServer, addedItem2Id, addedItem1Id, constants_1.POST + ' by _2', user_2, constants_1.PASSWORD);
        const chat_third = post3Result.data.addPost.chat;
        expect(chat_third.posts.length).toBe(3);
    }));
});
