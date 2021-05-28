import mongoose, { Schema, Document } from 'mongoose'
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
    __v: number,
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
    
})


const Item = mongoose.model<IItem>('Item', ItemSchema)

export default Item


