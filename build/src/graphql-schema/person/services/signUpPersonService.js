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
exports.signUpPersonService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configurations_1 = __importDefault(require("../../../utils/configurations"));
const errorMessages_1 = require("../helpers/errorMessages");
const signUpPersonService = (Person, personInput) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = personInput;
    if (email) {
        const existingPersonWithEmail = yield Person.find({ email: email });
        if (existingPersonWithEmail.length > 0) {
            return {
                code: '400',
                success: false,
                message: errorMessages_1.SIGNUP_EMAIL_ALREADY_IN_USE,
                id: undefined,
                username: undefined,
                facebookName: undefined,
                jwtToken: undefined
            };
        }
    }
    const existingPersonWithUsername = yield Person.find({ username: username });
    if (existingPersonWithUsername.length > 0) {
        return {
            code: '400',
            success: false,
            message: errorMessages_1.SIGNUP_USERNAME_ALREADY_IN_USE,
            id: undefined,
            username: undefined,
            facebookName: undefined,
            jwtToken: undefined
        };
    }
    const salt = bcryptjs_1.default.genSaltSync(10);
    const passwordHash = bcryptjs_1.default.hashSync(password, salt);
    let signingUpPerson = undefined;
    try {
        let personData = { username: username, passwordHash: passwordHash };
        if (email)
            personData = Object.assign(Object.assign({}, personData), { email: email });
        const personToAdd = new Person(personData);
        signingUpPerson = yield personToAdd.save();
        if (!signingUpPerson)
            throw new Error();
    }
    catch (error) {
        return {
            code: '400',
            success: false,
            message: errorMessages_1.SIGNUP_ERROR_DATABASE,
            id: undefined,
            username: undefined,
            facebookName: undefined,
            jwtToken: undefined
        };
    }
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 1);
    let tokenContent = { id: signingUpPerson._id, expires: expiryTime.toISOString() };
    if (signingUpPerson.username)
        tokenContent = Object.assign(Object.assign({}, tokenContent), { username: signingUpPerson.username });
    const token = jsonwebtoken_1.default.sign(tokenContent, configurations_1.default.JWT_SECRET);
    return {
        code: '200',
        success: true,
        message: errorMessages_1.SIGNUP_SUCCESS,
        id: signingUpPerson._id,
        username: username,
        facebookName: undefined,
        jwtToken: token
    };
});
exports.signUpPersonService = signUpPersonService;
