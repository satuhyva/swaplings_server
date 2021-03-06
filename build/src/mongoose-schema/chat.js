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
const mongoose_1 = __importStar(require("mongoose"));
const ChatSchema = new mongoose_1.Schema({
    itemIdA: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Item',
    },
    personIdA: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Person',
    },
    itemIdB: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Item',
    },
    personIdB: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Person',
    },
    posts: [
        {
            post: {
                type: String,
                required: true,
            },
            postingItemId: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
                ref: 'Item',
            },
            createdAt: {
                type: String,
                required: true,
            }
        }
    ]
}, {
    optimisticConcurrency: true,
    toJSON: {
        transform: function (_document, returnedObject) {
            return {
                id: returnedObject._id,
                itemIdA: returnedObject.itemIdA,
                personIdA: returnedObject.personIdA,
                itemIdB: returnedObject.itemIdB,
                personIdB: returnedObject.personIdB,
                posts: returnedObject.posts.map(post => {
                    return {
                        post: post.post,
                        postingItemId: post.postingItemId,
                        createdAt: post.createdAt
                    };
                })
            };
        }
    }
});
const Chat = mongoose_1.default.model('Chat', ChatSchema);
exports.default = Chat;
