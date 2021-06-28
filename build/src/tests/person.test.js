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
const errorMessages_1 = require("../graphql-schema/person/helpers/errorMessages");
const errorMessages_2 = require("../graphql-schema/custom-scalars/errorMessages");
const person_1 = __importDefault(require("../mongoose-schema/person"));
const errorMessages_3 = require("../graphql-schema/person/helpers/errorMessages");
const constants_1 = require("./constants");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configurations_1 = __importDefault(require("../utils/configurations"));
const index_2 = require("../../index");
const testServer = supertest_1.default(app_1.default);
describe('PERSON', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield index_1.connectToMongooseDatabase();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log('clear database before');
        yield clearTestDatabase_1.clearTestDatabase();
        console.log('clear database after');
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
        index_2.stopServer();
    }));
    test('given proper username, password and email, person can sign up', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = queries_1.signUpPersonQuery(constants_1.USERNAME, constants_1.PASSWORD, constants_1.EMAIL);
            console.log(query);
            const response = yield queries_1.performTestServerQuery(testServer, query);
            console.log(response);
            expect(response.status).toBe(200);
            const signedUpPerson = response.body.data.signUpPerson;
            expect(signedUpPerson.code).toBe('200');
            expect(signedUpPerson.success).toBe(true);
            expect(signedUpPerson.message).toBe(errorMessages_1.SIGNUP_SUCCESS);
            expect(signedUpPerson.username).toBe(constants_1.USERNAME);
            expect(signedUpPerson.facebookName).toBeNull();
            expect(signedUpPerson.jwtToken).toBeDefined();
            expect(signedUpPerson.id).toBeDefined();
            const person = yield person_1.default.findOne({ username: constants_1.USERNAME });
            expect(person.username).toBe(constants_1.USERNAME);
        }
        catch (error) {
            console.log(error);
        }
    }));
    test('given proper username and password (but no email), person can sign up', () => __awaiter(void 0, void 0, void 0, function* () {
        const query = queries_1.signUpPersonQuery(constants_1.USERNAME, constants_1.PASSWORD);
        const response = yield queries_1.performTestServerQuery(testServer, query);
        expect(response.status).toBe(200);
        const signedUpPerson = response.body.data.signUpPerson;
        expect(signedUpPerson.code).toBe('200');
        expect(signedUpPerson.success).toBe(true);
        expect(signedUpPerson.message).toBe(errorMessages_1.SIGNUP_SUCCESS);
        expect(signedUpPerson.username).toBe(constants_1.USERNAME);
        expect(signedUpPerson.facebookName).toBeNull();
        expect(signedUpPerson.jwtToken).toBeDefined();
        expect(signedUpPerson.id).toBeDefined();
        const person = yield person_1.default.findOne({ username: constants_1.USERNAME });
        expect(person.username).toBe(constants_1.USERNAME);
    }));
    test('given invalid (too short) username, a person cannot sign up', () => __awaiter(void 0, void 0, void 0, function* () {
        const query = queries_1.signUpPersonQuery('u', constants_1.PASSWORD, constants_1.EMAIL);
        const response = yield queries_1.performTestServerQuery(testServer, query);
        expect(response.status).toBe(400);
        const error = response.body.errors[0].message;
        expect(error).toContain(errorMessages_2.INVALID_USERNAME);
    }));
    test('given invalid (too long) username, a person cannot sign up', () => __awaiter(void 0, void 0, void 0, function* () {
        const query = queries_1.signUpPersonQuery('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', constants_1.PASSWORD, constants_1.EMAIL);
        const response = yield queries_1.performTestServerQuery(testServer, query);
        expect(response.status).toBe(400);
        const error = response.body.errors[0].message;
        expect(error).toContain(errorMessages_2.INVALID_USERNAME);
    }));
    test('given invalid (too short) password, a person cannot sign up', () => __awaiter(void 0, void 0, void 0, function* () {
        const query = queries_1.signUpPersonQuery(constants_1.USERNAME, '1234567', constants_1.EMAIL);
        const response = yield queries_1.performTestServerQuery(testServer, query);
        expect(response.status).toBe(400);
        const error = response.body.errors[0].message;
        expect(error).toContain(errorMessages_2.INVALID_PASSWORD);
    }));
    test('given invalid (too long) password, a person cannot sign up', () => __awaiter(void 0, void 0, void 0, function* () {
        const query = queries_1.signUpPersonQuery(constants_1.USERNAME, 'sssssssssssssssssssssssssssssssssssssssssssssss', constants_1.EMAIL);
        const response = yield queries_1.performTestServerQuery(testServer, query);
        expect(response.status).toBe(400);
        const error = response.body.errors[0].message;
        expect(error).toContain(errorMessages_2.INVALID_PASSWORD);
    }));
    test('given invalid email, a person cannot sign up', () => __awaiter(void 0, void 0, void 0, function* () {
        const query = queries_1.signUpPersonQuery(constants_1.USERNAME, constants_1.PASSWORD, 'shallan.davar.gmail.com');
        const response = yield queries_1.performTestServerQuery(testServer, query);
        expect(response.status).toBe(400);
        const error = response.body.errors[0].message;
        expect(error).toContain(errorMessages_2.INVALID_EMAIL);
    }));
    test('given valid username and password, a person can login', () => __awaiter(void 0, void 0, void 0, function* () {
        const personToAdd = new person_1.default({ username: constants_1.USERNAME, passwordHash: constants_1.PASSWORDHASH });
        yield personToAdd.save();
        const query = queries_1.loginPersonQuery(constants_1.USERNAME, constants_1.PASSWORD);
        const response = yield queries_1.performTestServerQuery(testServer, query);
        expect(response.status).toBe(200);
        const loggedInPerson = response.body.data.loginPerson;
        expect(loggedInPerson.code).toBe('200');
        expect(loggedInPerson.success).toBe(true);
        expect(loggedInPerson.message).toBe(errorMessages_1.LOGIN_WITH_USERNAME_AND_PASSWORD_SUCCESS);
        expect(loggedInPerson.username).toBe(constants_1.USERNAME);
        expect(loggedInPerson.facebookName).toBeNull();
        expect(loggedInPerson.jwtToken).toBeDefined();
        expect(loggedInPerson.id).toBeDefined();
        const person = yield person_1.default.findOne({ username: constants_1.USERNAME });
        expect(person.username).toBe(constants_1.USERNAME);
    }));
    test('given invalid username, a person cannot login', () => __awaiter(void 0, void 0, void 0, function* () {
        const personToAdd = new person_1.default({ username: constants_1.USERNAME, passwordHash: constants_1.PASSWORDHASH });
        yield personToAdd.save();
        const person = yield person_1.default.findOne({ username: constants_1.USERNAME });
        expect(person.username).toBe(constants_1.USERNAME);
        const query = queries_1.loginPersonQuery('invalid username', constants_1.PASSWORD);
        const response = yield queries_1.performTestServerQuery(testServer, query);
        const responseData = response.body.data.loginPerson;
        expect(responseData.code).toBe('400');
        expect(responseData.success).toBe(false);
        expect(responseData.message).toBe(errorMessages_3.LOGIN_FAILED_INVALID_USERNAME_AND_OR_PASSWORD);
        expect(responseData.username).toBeNull();
        expect(responseData.facebookName).toBeNull();
        expect(responseData.jwtToken).toBeNull();
        expect(responseData.id).toBeNull();
    }));
    test('given invalid password, a person cannot login', () => __awaiter(void 0, void 0, void 0, function* () {
        const personToAdd = new person_1.default({ username: constants_1.USERNAME, passwordHash: constants_1.PASSWORDHASH });
        yield personToAdd.save();
        const person = yield person_1.default.findOne({ username: constants_1.USERNAME });
        expect(person.username).toBe(constants_1.USERNAME);
        const query = queries_1.loginPersonQuery(constants_1.USERNAME, 'invalid password');
        const response = yield queries_1.performTestServerQuery(testServer, query);
        const responseData = response.body.data.loginPerson;
        expect(responseData.code).toBe('400');
        expect(responseData.success).toBe(false);
        expect(responseData.message).toBe(errorMessages_3.LOGIN_FAILED_INVALID_USERNAME_AND_OR_PASSWORD);
        expect(responseData.username).toBeNull();
        expect(responseData.facebookName).toBeNull();
        expect(responseData.jwtToken).toBeNull();
        expect(responseData.id).toBeNull();
    }));
    test('given person is authorized, person can remove him or herself from database (username)', () => __awaiter(void 0, void 0, void 0, function* () {
        const personToAdd = new person_1.default({ username: constants_1.USERNAME, passwordHash: constants_1.PASSWORDHASH });
        yield personToAdd.save();
        const personsBefore = yield person_1.default.find({ username: constants_1.USERNAME });
        expect(personsBefore.length).toBe(1);
        const queryLogin = queries_1.loginPersonQuery(constants_1.USERNAME, constants_1.PASSWORD);
        const responseLogin = yield queries_1.performTestServerQuery(testServer, queryLogin);
        const responseLoginData = responseLogin.body.data.loginPerson;
        const token = responseLoginData.jwtToken;
        const queryRemove = queries_1.removePersonQuery();
        const responseRemove = yield queries_1.performAuthorizedTestServerQuery(testServer, queryRemove, token);
        const responseRemoveData = responseRemove.body.data.removePerson;
        expect(responseRemoveData.code).toBe('200');
        expect(responseRemoveData.success).toBe(true);
        expect(responseRemoveData.message).toBe(errorMessages_1.REMOVE_PERSON_SUCCESS);
        expect(responseRemoveData.username).toBe(constants_1.USERNAME);
        expect(responseRemoveData.facebookName).toBeNull();
        expect(responseRemoveData.id).toBeDefined();
        const personsAfter = yield person_1.default.find({ username: constants_1.USERNAME });
        expect(personsAfter.length).toBe(0);
    }));
    test('given person is authorized, person can remove him or herself from database (facebook name)', () => __awaiter(void 0, void 0, void 0, function* () {
        const personToAdd = new person_1.default({ facebookId: constants_1.FACEBOOK_ID, facebookName: constants_1.FACEBOOK_NAME });
        const createdPerson = yield personToAdd.save();
        // Token is artificially created here because mocking node-fetch does not work with GraphQL queries.
        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + 1);
        const JWT_TOKEN_FACEBOOK = jsonwebtoken_1.default.sign({ id: createdPerson._id, facebookName: constants_1.FACEBOOK_NAME, expires: expiryTime.toISOString() }, configurations_1.default.JWT_SECRET);
        const personsBefore = yield person_1.default.find({ facebookId: constants_1.FACEBOOK_ID });
        expect(personsBefore.length).toBe(1);
        const queryRemove = queries_1.removePersonQuery();
        const responseRemove = yield queries_1.performAuthorizedTestServerQuery(testServer, queryRemove, JWT_TOKEN_FACEBOOK);
        const responseRemoveData = responseRemove.body.data.removePerson;
        expect(responseRemoveData.code).toBe('200');
        expect(responseRemoveData.success).toBe(true);
        expect(responseRemoveData.message).toBe(errorMessages_1.REMOVE_PERSON_SUCCESS);
        expect(responseRemoveData.username).toBeNull();
        expect(responseRemoveData.facebookName).toBe(constants_1.FACEBOOK_NAME);
        expect(responseRemoveData.id).toBeDefined();
        const personsAfter = yield person_1.default.find({ facebookId: constants_1.FACEBOOK_ID });
        expect(personsAfter.length).toBe(0);
    }));
});
