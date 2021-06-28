"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const JWT_SECRET = process.env.JWT_SECRET || '';
const E2E = process.env.E2E || '';
const DEV = process.env.DEV || '';
let MONGO_DB_URL = '';
if (process.env.NODE_ENV === 'githubaction') {
    MONGO_DB_URL = 'mongodb://localhost:27017';
}
else if (process.env.NODE_ENV === 'test' || process.env.E2E === 'e2e' || process.env.DEV === 'dev') {
    MONGO_DB_URL = process.env.MONGO_DB_TEST_URL;
}
else {
    MONGO_DB_URL = process.env.MONGO_DB_URL;
}
if (!MONGO_DB_URL)
    throw new Error('MONGO_DB_URL is missing a value!');
exports.default = {
    PORT,
    NODE_ENV,
    MONGO_DB_URL,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    JWT_SECRET,
    E2E,
    DEV
};
