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
exports.loginPersonWithFacebookService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configurations_1 = __importDefault(require("../../../utils/configurations"));
const errorMessages_1 = require("../helpers/errorMessages");
const node_fetch_1 = __importDefault(require("node-fetch"));
const fetchPersonDataFromFacebookGraphAPI = (userId, facebookAccessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://graph.facebook.com/${userId}?fields=id,name&access_token=${facebookAccessToken}`;
    const response = yield node_fetch_1.default(url);
    const responseJSON = yield response.json();
    if (responseJSON.id && responseJSON.name && responseJSON.id === userId) {
        return responseJSON;
    }
    else
        return undefined;
});
const loginPersonWithFacebookService = (facebookLoginInput, Person) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, facebookAccessToken } = facebookLoginInput;
    let personData = undefined;
    try {
        const facebookResponseData = yield fetchPersonDataFromFacebookGraphAPI(userId, facebookAccessToken);
        if (facebookResponseData)
            personData = facebookResponseData;
        else
            throw new Error();
    }
    catch (error) {
        return {
            code: '400',
            success: false,
            message: errorMessages_1.LOGIN_FACEBOOK_GRAPH_API_ERROR,
            id: undefined,
            username: undefined,
            facebookName: undefined,
            jwtToken: undefined
        };
    }
    let loggingInPerson = null;
    try {
        const persons = yield Person.find({ facebookId: personData.id });
        if (persons.length === 0) {
            const personToAdd = new Person({ facebookId: personData.id, facebookName: personData.name });
            loggingInPerson = yield personToAdd.save();
        }
        else {
            loggingInPerson = persons[0];
        }
        if (!loggingInPerson)
            throw new Error();
    }
    catch (error) {
        return {
            code: '400',
            success: false,
            message: errorMessages_1.LOGIN_FACEBOOK_DATABASE_ERROR,
            id: undefined,
            username: undefined,
            facebookName: undefined,
            jwtToken: undefined
        };
    }
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 1);
    let tokenContent = { id: loggingInPerson._id, expires: expiryTime.toISOString() };
    if (loggingInPerson.facebookName)
        tokenContent = Object.assign(Object.assign({}, tokenContent), { facebookName: personData.name });
    const token = jsonwebtoken_1.default.sign(tokenContent, configurations_1.default.JWT_SECRET);
    return {
        code: '200',
        success: true,
        message: errorMessages_1.LOGIN_FACEBOOK_SUCCESS,
        id: loggingInPerson._id,
        facebookName: personData.name,
        jwtToken: token,
        username: undefined
    };
});
exports.loginPersonWithFacebookService = loginPersonWithFacebookService;
