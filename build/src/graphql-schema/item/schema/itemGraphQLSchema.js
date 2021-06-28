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
const apollo_server_express_1 = require("apollo-server-express");
const addItemService_1 = require("../services/addItemService");
const getPersonService_1 = require("../../person/services/getPersonService");
const myItemsService_1 = require("../services/myItemsService");
const matchedToOrFromService_1 = require("../services/matchedToOrFromService");
const addMatchService_1 = require("../services/addMatchService");
const browseItemsByPageService_1 = require("../services/browseItemsByPageService");
const removeMatchService_1 = require("../services/removeMatchService");
const addPostService_1 = require("../services/addPostService");
const itemsChatService_1 = require("../services/itemsChatService");
const typeDefs = apollo_server_express_1.gql `

    input AddItemInput {
        title: String! 
        priceGroup: PriceGroup! 
        description: String! 
        brand: String
        imagePublicId: String
        imageSecureUrl: String
    }

    input ChangeMatchInput {
        myItemId: ID!
        itemToId: ID!
    }

    input BrowseItemsInput {
        priceGroups: [PriceGroup]
        phrasesInTitle: [String]
        phrasesInDescription: [String]
        brands: [String]
    }

    input BrowseItemsByPageInput {
        first: Int
        after: String
        browseItemsInput: BrowseItemsInput!
    }

    input AddPostInput {
        itemIdA: ID!
        itemIdB: ID!
        post: String!
    }

    input ItemsChatInput {
        itemIdA: ID!
        itemIdB: ID!
    }

    type Item {
        id: ID!
        title: String!
        priceGroup: PriceGroup! 
        description: String! 
        brand: String
        imagePublicId: String
        imageSecureUrl: String
        owner: Person!
        matchedTo: [Item]
        matchedFrom: [Item]
    }

    type Post {
        post: String!
        postingItemId: ID!
        createdAt: String
    }

    type Chat {
        id: ID!
        itemIdA: ID!
        personIdA: ID!
        itemIdB: ID!
        personIdB: ID!  
        posts: [Post]!      
    }

    type ItemsChatResponse {
        id: ID
        itemIdA: ID!
        itemIdB: ID! 
        posts: [Post]! 
    }
    
    type AddItemResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        item: Item
    }

    type ChangeMatchResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        myItem: Item
    }

    type AddPostResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        chat: Chat
    }

    type Edge {
        cursor: String
        node: Item
    }

    type PageInfo {
        endCursor: String
        hasNextPage: Boolean,
        startCursor: String,
        hasPreviousPage: Boolean
    }


    type BrowseItemsByPageResponse {
        edges: [Edge]
        pageInfo: PageInfo
    }


    extend type Query {
        myItems: [Item]
        browseItemsByPage(browseItemsByPageInput: BrowseItemsByPageInput!): BrowseItemsByPageResponse
        itemsChat(itemsChatInput: ItemsChatInput!): ItemsChatResponse
    }  

    extend type Mutation {
        addItem(addItemInput: AddItemInput!): AddItemResponse
        addMatch(changeMatchInput: ChangeMatchInput): ChangeMatchResponse
        removeMatch(changeMatchInput: ChangeMatchInput): ChangeMatchResponse
        addPost(addPostInput: AddPostInput!): AddPostResponse
    }
`;
const resolvers = {
    Query: {
        myItems: (_root, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return yield myItemsService_1.myItemsService(context.authenticatedPerson, context.Item);
        }),
        browseItemsByPage: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return yield browseItemsByPageService_1.browseItemsByPageService(context.authenticatedPerson, context.Item, args.browseItemsByPageInput);
        }),
        itemsChat: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return yield itemsChatService_1.itemsChatService(context.authenticatedPerson, context.Item, context.Chat, args.itemsChatInput);
        }),
    },
    Mutation: {
        addItem: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return addItemService_1.addItemService(context.authenticatedPerson, context.Person, context.Item, args.addItemInput);
        }),
        addMatch: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return addMatchService_1.addMatchService(context.authenticatedPerson, context.Item, args.changeMatchInput);
        }),
        removeMatch: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return removeMatchService_1.removeMatchService(context.authenticatedPerson, context.Item, context.Chat, args.changeMatchInput);
        }),
        addPost: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return addPostService_1.addPostService(context.authenticatedPerson, context.Item, context.Chat, args.addPostInput);
        }),
    },
    Item: {
        owner: (root, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return getPersonService_1.getPersonService(root.ownerPersonId, context.Person);
        }),
        matchedTo: (root, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return matchedToOrFromService_1.matchedToOrFromService(root.matchedToIds, context.Item);
        }),
        matchedFrom: (root, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return matchedToOrFromService_1.matchedToOrFromService(root.matchedFromIds, context.Item);
        }),
    }
};
exports.default = {
    typeDefs,
    resolvers
};
