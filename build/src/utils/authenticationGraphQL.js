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
exports.authenticationGraphQL = exports.AUTHENTICATION_FAILED = void 0;
const person_1 = __importDefault(require("../mongoose-schema/person"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configurations_1 = __importDefault(require("../utils/configurations"));
const apollo_server_express_1 = require("apollo-server-express");
exports.AUTHENTICATION_FAILED = 'Authentication failed. Could not find person in database.';
const authenticationGraphQL = (request) => __awaiter(void 0, void 0, void 0, function* () {
    const authentication = request.headers.authorization;
    if (authentication) {
        const decodedToken = jsonwebtoken_1.default.verify(authentication, configurations_1.default.JWT_SECRET);
        const tokenContent = decodedToken;
        const hasNotExpired = !!tokenContent.expires && new Date(tokenContent.expires) > new Date();
        if (hasNotExpired && !tokenContent.id || (!tokenContent.username && !tokenContent.facebookName))
            throw new apollo_server_express_1.ApolloError(exports.AUTHENTICATION_FAILED);
        const person = yield person_1.default.findById(tokenContent.id);
        if (!person)
            throw new apollo_server_express_1.ApolloError(exports.AUTHENTICATION_FAILED);
        return person;
    }
    return undefined;
});
exports.authenticationGraphQL = authenticationGraphQL;
