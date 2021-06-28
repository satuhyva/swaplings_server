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
exports.stopServer = exports.connectToMongooseDatabase = void 0;
const app_1 = __importDefault(require("./src/app"));
const configurations_1 = __importDefault(require("./src/utils/configurations"));
const mongoose_1 = __importDefault(require("mongoose"));
const clearTestDatabase_1 = require("./src/tests/clearTestDatabase");
const connectToMongooseDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.set('useFindAndModify', false);
    mongoose_1.default.set('useCreateIndex', true);
    try {
        yield mongoose_1.default.connect(configurations_1.default.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        if (process.env.NODE_ENV !== 'test') {
            console.log('Connected to MongoDB');
        }
        if (process.env.E2E === 'e2e') {
            yield clearTestDatabase_1.clearTestDatabase();
            console.log('Cleared test database for E2E testing');
        }
        if (process.env.DEV === 'dev') {
            yield clearTestDatabase_1.clearTestDatabase();
            console.log('Cleared test database for running in development mode');
        }
    }
    catch (error) {
        console.log('Error in connecting to MongoDB:', error);
    }
});
exports.connectToMongooseDatabase = connectToMongooseDatabase;
let server;
const startServer = () => {
    try {
        server = app_1.default.listen({ port: configurations_1.default.PORT }, () => {
            if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'production') {
                console.log('Swaplings server ready at PORT', configurations_1.default.PORT);
            }
        });
    }
    catch (error) {
        console.log('Error in starting the server', error);
    }
};
const connectToDatabaseAndStartServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.connectToMongooseDatabase();
    startServer();
});
const stopServer = () => {
    server.close();
};
exports.stopServer = stopServer;
void connectToDatabaseAndStartServer();
