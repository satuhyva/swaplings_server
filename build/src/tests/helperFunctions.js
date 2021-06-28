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
exports.addPostToItemsChat = exports.addPersonAndAnItemToPerson = exports.addPersonToDatabaseAndPerformLogin = exports.loginAndGetToken = void 0;
const person_1 = __importDefault(require("../mongoose-schema/person"));
const queries_1 = require("./queries");
const queries_2 = require("./queries");
const loginAndGetToken = (testServer, username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const queryLogin = queries_1.loginPersonQuery(username, password);
    const responseLogin = yield queries_1.performTestServerQuery(testServer, queryLogin);
    const loggedInPerson = responseLogin.body.data.loginPerson;
    const token = loggedInPerson.jwtToken;
    if (!token)
        throw new Error('Token is required but it is missing.');
    return token;
});
exports.loginAndGetToken = loginAndGetToken;
const addPersonToDatabaseAndPerformLogin = (testServer, username, password, passwordHash) => __awaiter(void 0, void 0, void 0, function* () {
    const personToAdd = new person_1.default({ username: username, passwordHash: passwordHash });
    yield personToAdd.save();
    const token = yield exports.loginAndGetToken(testServer, username, password);
    // const queryLogin = loginPersonQuery(username, password)
    // const responseLogin = await performTestServerQuery(testServer, queryLogin) as Response
    // const loggedInPerson = (responseLogin.body as unknown as LoginPersonResponseType).data.loginPerson
    // const token = loggedInPerson.jwtToken
    // if (!token) throw new Error('Token is required but it is missing.')
    return token;
});
exports.addPersonToDatabaseAndPerformLogin = addPersonToDatabaseAndPerformLogin;
const addPersonAndAnItemToPerson = (testServer, username, password, passwordHash, title, priceGroup, description, brand, imagePublicId, imageSecureUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield exports.addPersonToDatabaseAndPerformLogin(testServer, username, password, passwordHash);
    const addItem = queries_2.addItemQuery(title, priceGroup, description, brand, imagePublicId, imageSecureUrl);
    const responseAddItem = yield queries_2.performAuthorizedTestServerQuery(testServer, addItem, token);
    const addedItemResponse = responseAddItem.body;
    return addedItemResponse;
});
exports.addPersonAndAnItemToPerson = addPersonAndAnItemToPerson;
const addPostToItemsChat = (testServer, itemIdA, itemIdB, post, username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield exports.loginAndGetToken(testServer, username, password);
    const addPost = queries_2.addPostQuery(itemIdA, itemIdB, post);
    const response = yield queries_2.performAuthorizedTestServerQuery(testServer, addPost, token);
    const addPostResponse = response.body;
    return addPostResponse;
});
exports.addPostToItemsChat = addPostToItemsChat;
