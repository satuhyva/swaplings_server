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
const ItemSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    priceGroup: {
        type: String,
        required: true,
    },
    ownerPersonId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Person'
    },
    matchedToIds: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Item'
        }
    ],
    matchedFromIds: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Item'
        }
    ],
    imagePublicId: {
        type: String,
    },
    imageSecureUrl: {
        type: String,
    },
    brand: {
        type: String,
    },
    createdAt: {
        type: Number,
        default: () => Date.now()
    }
}, {
    optimisticConcurrency: true,
});
ItemSchema.methods.toPublicItem = function () {
    const thisItem = this;
    return {
        id: thisItem._id,
        title: thisItem.title,
        description: thisItem.description,
        priceGroup: thisItem.priceGroup,
        imagePublicId: thisItem.imagePublicId,
        imageSecureUrl: thisItem.imageSecureUrl,
        brand: thisItem.brand,
    };
};
ItemSchema.methods.toDatabaseItem = function () {
    const thisItem = this;
    return {
        id: thisItem._id,
        title: thisItem.title,
        description: thisItem.description,
        priceGroup: thisItem.priceGroup,
        ownerPersonId: thisItem.ownerPersonId,
        matchedToIds: thisItem.matchedToIds,
        matchedFromIds: thisItem.matchedFromIds,
        imagePublicId: thisItem.imagePublicId,
        imageSecureUrl: thisItem.imageSecureUrl,
        brand: thisItem.brand,
    };
};
const Item = mongoose_1.default.model('Item', ItemSchema);
exports.default = Item;
