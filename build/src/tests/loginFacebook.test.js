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
const index_1 = require("../../index");
const mongoose_1 = __importDefault(require("mongoose"));
const clearTestDatabase_1 = require("./clearTestDatabase");
const errorMessages_1 = require("../graphql-schema/person/helpers/errorMessages");
const node_fetch_1 = __importDefault(require("node-fetch"));
const utils_1 = require("ts-jest/utils");
const loginPersonWithFacebookService_1 = require("../graphql-schema/person/services/loginPersonWithFacebookService");
const person_1 = __importDefault(require("../mongoose-schema/person"));
const constants_1 = require("./constants");
const index_2 = require("../../index");
// The GraphQL queries do not work when node-fetch is mocked.
// Therefore here only the service function is tested.
jest.mock('node-fetch', () => {
    return jest.fn();
});
const setFetchMock = (id, name) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    utils_1.mocked(node_fetch_1.default).mockImplementationOnce(() => {
        return Promise.resolve({
            json() {
                return Promise.resolve({ id: id, name: name });
            }
        });
    });
};
describe('FACEBOOK LOGIN / SIGNUP', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield index_1.connectToMongooseDatabase();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield clearTestDatabase_1.clearTestDatabase();
        utils_1.mocked(node_fetch_1.default).mockClear();
    }));
    test('given valid Facebook userId and accessToken, a new person can be added to the database', () => __awaiter(void 0, void 0, void 0, function* () {
        setFetchMock(constants_1.FACEBOOK_ID, constants_1.FACEBOOK_NAME);
        const response = yield loginPersonWithFacebookService_1.loginPersonWithFacebookService({ userId: constants_1.FACEBOOK_ID, facebookAccessToken: constants_1.FACEBOOK_ACCESS_TOKEN }, person_1.default);
        expect(response.code).toBe('200');
        expect(response.success).toBe(true);
        expect(response.message).toBe(errorMessages_1.LOGIN_FACEBOOK_SUCCESS);
        expect(response.username).toBeUndefined();
        expect(response.facebookName).toBe(constants_1.FACEBOOK_NAME);
        expect(response.jwtToken).toBeDefined();
        expect(response.id).toBeDefined();
        const person = yield person_1.default.findOne({ facebookId: constants_1.FACEBOOK_ID });
        expect(person.facebookName).toBe(constants_1.FACEBOOK_NAME);
    }));
    test('given valid Facebook userId and accessToken, an existing person can be found in the database', () => __awaiter(void 0, void 0, void 0, function* () {
        setFetchMock(constants_1.FACEBOOK_ID, constants_1.FACEBOOK_NAME);
        const personToAdd = new person_1.default({ facebookId: constants_1.FACEBOOK_ID, facebookName: constants_1.FACEBOOK_NAME });
        yield personToAdd.save();
        const person = yield person_1.default.findOne({ facebookId: constants_1.FACEBOOK_ID });
        expect(person.facebookName).toBe(constants_1.FACEBOOK_NAME);
        const response = yield loginPersonWithFacebookService_1.loginPersonWithFacebookService({ userId: constants_1.FACEBOOK_ID, facebookAccessToken: constants_1.FACEBOOK_ACCESS_TOKEN }, person_1.default);
        expect(response.code).toBe('200');
        expect(response.success).toBe(true);
        expect(response.message).toBe(errorMessages_1.LOGIN_FACEBOOK_SUCCESS);
        expect(response.username).toBeUndefined();
        expect(response.facebookName).toBe(constants_1.FACEBOOK_NAME);
        expect(response.jwtToken).toBeDefined();
        expect(response.id).toBeDefined();
    }));
    test('given invalid Facebook userId, a person cannot sign up', () => __awaiter(void 0, void 0, void 0, function* () {
        setFetchMock(constants_1.FACEBOOK_ID, constants_1.FACEBOOK_NAME);
        const response = yield loginPersonWithFacebookService_1.loginPersonWithFacebookService({ userId: 'wrong id', facebookAccessToken: constants_1.FACEBOOK_ACCESS_TOKEN }, person_1.default);
        expect(response.code).toBe('400');
        expect(response.success).toBe(false);
        expect(response.message).toBe(errorMessages_1.LOGIN_FACEBOOK_GRAPH_API_ERROR);
        expect(response.username).toBeUndefined();
        expect(response.facebookName).toBeUndefined();
        expect(response.jwtToken).toBeUndefined();
        expect(response.id).toBeUndefined();
        const persons = yield person_1.default.find({ facebookId: constants_1.FACEBOOK_ID });
        expect(persons.length).toBe(0);
    }));
    test('given invalid Facebook userId, a person cannot log in', () => __awaiter(void 0, void 0, void 0, function* () {
        const personToAdd = new person_1.default({ facebookId: constants_1.FACEBOOK_ID, facebookName: constants_1.FACEBOOK_NAME });
        yield personToAdd.save();
        const person = yield person_1.default.findOne({ facebookId: constants_1.FACEBOOK_ID });
        expect(person.facebookName).toBe(constants_1.FACEBOOK_NAME);
        setFetchMock(constants_1.FACEBOOK_ID, constants_1.FACEBOOK_NAME);
        const response = yield loginPersonWithFacebookService_1.loginPersonWithFacebookService({ userId: 'wrong id', facebookAccessToken: constants_1.FACEBOOK_ACCESS_TOKEN }, person_1.default);
        expect(response.code).toBe('400');
        expect(response.success).toBe(false);
        expect(response.message).toBe(errorMessages_1.LOGIN_FACEBOOK_GRAPH_API_ERROR);
        expect(response.username).toBeUndefined();
        expect(response.facebookName).toBeUndefined();
        expect(response.jwtToken).toBeUndefined();
        expect(response.id).toBeUndefined();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
        index_2.stopServer();
    }));
});
