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
exports.clearTestDatabase = void 0;
const chat_1 = __importDefault(require("../mongoose-schema/chat"));
const item_1 = __importDefault(require("../mongoose-schema/item"));
const person_1 = __importDefault(require("../mongoose-schema/person"));
const clearTestDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    yield person_1.default.deleteMany({});
    yield item_1.default.deleteMany({});
    yield chat_1.default.deleteMany({});
});
exports.clearTestDatabase = clearTestDatabase;
