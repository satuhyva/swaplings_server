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
exports.databaseError = void 0;
const errorMessages_1 = require("../helpers/errorMessages");
const databaseError = (session, errorMessage, authenticatedPerson) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    yield session.abortTransaction();
    session.endSession();
    console.log(errorMessage);
    return {
        code: '500',
        success: false,
        message: errorMessages_1.REMOVE_PERSON_DATABASE_ERROR,
        id: authenticatedPerson._id,
        username: (_a = authenticatedPerson.username) !== null && _a !== void 0 ? _a : undefined,
        facebookName: (_b = authenticatedPerson.facebookName) !== null && _b !== void 0 ? _b : undefined
    };
});
exports.databaseError = databaseError;
