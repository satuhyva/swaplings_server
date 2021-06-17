import mongoose, { Schema, Document } from 'mongoose'
import { ItemDatabaseType } from '../types/item/ItemDatabaseType'
import { ItemPublicType } from '../types/item/ItemPublicType'
import { PriceGroupEnum } from '../types/price-group/PriceGroupEnum'
import { IPerson } from './person'


export interface IItem extends Document {
    _id: string,
    title: string,
    description: string,
    priceGroup: PriceGroupEnum,
    ownerPersonId: IPerson['_id'],
    matchedToIds: IItem['_id'][],
    matchedFromIds: IItem['_id'][],
    imagePublicId: string | undefined,
    imageSecureUrl: string | undefined,
    brand: string | undefined,
    createdAt: number,
    __v: number,
    toPublicItem: () => ItemPublicType,
    toDatabaseItem: () => ItemDatabaseType,
}



const ItemSchema: Schema = new Schema({
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
        type: Schema.Types.ObjectId,
        ref: 'Person'
    },
    matchedToIds: [
            {
            type: Schema.Types.ObjectId,
            ref: 'Item'
        }
    ],
    matchedFromIds: [
            {
            type: Schema.Types.ObjectId,
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
    
},
    { 
        optimisticConcurrency: true,
    }
)

ItemSchema.methods.toPublicItem = function (): ItemPublicType {
    const thisItem = this as IItem
    return {
        id: thisItem._id, 
        title: thisItem.title, 
        description: thisItem.description, 
        priceGroup: thisItem.priceGroup, 
        imagePublicId: thisItem.imagePublicId,
        imageSecureUrl: thisItem.imageSecureUrl,
        brand: thisItem.brand,
    }
}

ItemSchema.methods.toDatabaseItem = function (): ItemDatabaseType {
    const thisItem = this as IItem
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
    }
}


const Item = mongoose.model<IItem>('Item', ItemSchema)

export default Item


