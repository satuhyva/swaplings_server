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
exports.loginPersonService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configurations_1 = __importDefault(require("../../../utils/configurations"));
const errorMessages_1 = require("../helpers/errorMessages");
const loginPersonService = (loginInput, Person) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = loginInput;
    let loggingInPerson = null;
    loggingInPerson = yield Person.findOne({ username: username });
    let passwordIsCorrect = false;
    if (loggingInPerson && loggingInPerson.passwordHash) {
        passwordIsCorrect = yield bcryptjs_1.default.compare(password, loggingInPerson.passwordHash);
    }
    if (!loggingInPerson || !passwordIsCorrect) {
        return {
            code: '400',
            success: false,
            message: errorMessages_1.LOGIN_FAILED_INVALID_USERNAME_AND_OR_PASSWORD,
            id: undefined,
            username: undefined,
            facebookName: undefined,
            jwtToken: undefined
        };
    }
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 1);
    let tokenContent = { id: loggingInPerson._id, expires: expiryTime.toISOString() };
    if (loggingInPerson.username)
        tokenContent = Object.assign(Object.assign({}, tokenContent), { username: loggingInPerson.username });
    const token = jsonwebtoken_1.default.sign(tokenContent, configurations_1.default.JWT_SECRET);
    return {
        code: '200',
        success: true,
        message: errorMessages_1.LOGIN_WITH_USERNAME_AND_PASSWORD_SUCCESS,
        id: loggingInPerson._id,
        username: username,
        facebookName: undefined,
        jwtToken: token
    };
});
exports.loginPersonService = loginPersonService;
