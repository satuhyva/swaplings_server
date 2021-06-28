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
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const typeDefsAndResolversCombined_1 = __importDefault(require("./graphql-schema/combine-schemas/typeDefsAndResolversCombined"));
const person_1 = __importDefault(require("./mongoose-schema/person"));
const item_1 = __importDefault(require("./mongoose-schema/item"));
const chat_1 = __importDefault(require("./mongoose-schema/chat"));
const imageRouter_1 = __importDefault(require("./routes/images/imageRouter"));
const authenticationGraphQL_1 = require("./utils/authenticationGraphQL");
const cors_1 = __importDefault(require("cors"));
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.urlencoded());
// TODO: Add authentication also to upload route!!!!!
app.get('/health', (_request, response) => {
    response.send('OK');
});
app.use('/upload', imageRouter_1.default);
const server = new apollo_server_express_1.ApolloServer(Object.assign(Object.assign({}, typeDefsAndResolversCombined_1.default), { context: ({ req }) => __awaiter(void 0, void 0, void 0, function* () {
        const authenticatedPerson = yield authenticationGraphQL_1.authenticationGraphQL(req);
        return {
            Person: person_1.default,
            Item: item_1.default,
            Chat: chat_1.default,
            authenticatedPerson
        };
    }) }));
server.applyMiddleware({
    path: '/graphql',
    app
});
exports.default = app;
