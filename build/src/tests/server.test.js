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
const testServer = supertest_1.default(app_1.default);
const queries_1 = require("./queries");
const index_1 = require("../../index");
const mongoose_1 = __importDefault(require("mongoose"));
describe('SERVER', () => {
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
        index_1.stopServer();
    }));
    test('can be started and a REST GET request to "/health" results in an "OK" response', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield testServer
            .get('/health')
            .send();
        expect(response.status).toBe(200);
        expect(response.text).toBe('OK');
    }));
    test('can be started and a GraphQL QUERY "health" results in an "OK" response', () => __awaiter(void 0, void 0, void 0, function* () {
        const query = `
                query {
                    health
                }
            `;
        const response = yield queries_1.performTestServerQuery(testServer, query);
        expect(response.status).toBe(200);
        expect(response.body.data.health).toBe('OK');
    }));
    //     test('Unknown endpoint returns unknown endpoint', async () => {
    //       const response = await server
    //           .get('/someunknownendpoint')
    //           .send()
    //       expect(response.status).toBe(404)
    //       expect(response.text).toContain('UNKNOWN ENDPOINT')
    //   })
});
