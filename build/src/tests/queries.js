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
exports.addPostQuery = exports.myItemsQuery = exports.addItemQuery = exports.removePersonQuery = exports.loginPersonQuery = exports.signUpPersonQuery = exports.performAuthorizedTestServerQuery = exports.performTestServerQuery = void 0;
const performTestServerQuery = (testServer, query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield testServer
        .post('/graphql')
        .send({
        query: query
    });
});
exports.performTestServerQuery = performTestServerQuery;
const performAuthorizedTestServerQuery = (testServer, query, token) => __awaiter(void 0, void 0, void 0, function* () {
    return yield testServer
        .post('/graphql')
        .set('authorization', token)
        .send({
        query: query
    });
});
exports.performAuthorizedTestServerQuery = performAuthorizedTestServerQuery;
const signUpPersonQuery = (username, password, email) => {
    let parameters = `username: "${username}", password: "${password}"`;
    if (email) {
        parameters += `, email: "${email}"`;
    }
    return `
        mutation {
            signUpPerson(
                signUpInput: {
                    ${parameters}
                }
            ) {  
                code,
                success,
                message,
                id,
                username, 
                facebookName,
                jwtToken
            }
        }
    `;
};
exports.signUpPersonQuery = signUpPersonQuery;
const loginPersonQuery = (username, password) => {
    const parameters = `username: "${username}", password: "${password}"`;
    return `
        mutation {
            loginPerson(
                loginInput: {
                    ${parameters}
                }
            ) {  
                code,
                success,
                message,
                id,
                username, 
                facebookName,
                jwtToken
            }
        }
    `;
};
exports.loginPersonQuery = loginPersonQuery;
const removePersonQuery = () => {
    return `
        mutation {
            removePerson {  
                code,
                success,
                message,
                id,
                username, 
                facebookName
            }
        }
    `;
};
exports.removePersonQuery = removePersonQuery;
const addItemQuery = (title, priceGroup, description, brand, imagePublicId, imageSecureUrl) => {
    let parameters = `title: "${title}", priceGroup: "${priceGroup}", description: "${description}"`;
    if (brand)
        parameters += `, brand: "${brand}"`;
    if (imagePublicId)
        parameters += `, imagePublicId: "${imagePublicId}"`;
    if (imageSecureUrl)
        parameters += `, imageSecureUrl: "${imageSecureUrl}"`;
    return `
        mutation {
            addItem(
                addItemInput: {
                    ${parameters}
                }
            ) {  
                code,
                success,
                message,
                item {
                    id
                    title
                    priceGroup
                    description
                    brand
                    imagePublicId
                    imageSecureUrl
                    owner {
                        id
                    }
                    matchedTo {
                        id
                    }
                    matchedFrom {
                        id
                    }
                }
            }
        }
    `;
};
exports.addItemQuery = addItemQuery;
const myItemsQuery = () => {
    return `
        query {
            myItems {  
                    id
                    title
                    priceGroup
                    description
                    brand
                    imagePublicId
                    imageSecureUrl
                    owner {
                        id
                    }
                    matchedTo {
                        id
                    }
                    matchedFrom {
                        id
                    }
            }
        }
    `;
};
exports.myItemsQuery = myItemsQuery;
const addPostQuery = (itemIdA, itemIdB, post) => {
    const parameters = `itemIdA: "${itemIdA}", itemIdB: "${itemIdB}", post: "${post}"`;
    return `
        mutation {
            addPost(
                addPostInput: {
                    ${parameters}
                }
            ) {  
                code,
                success,
                message,
                chat {
                    id
                    itemIdA
                    personIdA
                    itemIdB
                    personIdB  
                    posts {
                        post
                        postingItemId
                        createdAt
                    }                    
                }  
            }
        }
    `;
};
exports.addPostQuery = addPostQuery;
