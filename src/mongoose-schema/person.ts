import mongoose, { Schema, Document } from 'mongoose'
import { IItem } from './item'

//https://tomanagle.medium.com/strongly-typed-models-with-mongoose-and-typescript-7bc2f7197722


export interface IPerson extends Document {
    _id: string,
    username: string | null,
    passwordHash: string | null,
    email: string | null,
    facebookId: string | null,
    facebookName: string | null,
    ownedItemIds: IItem['_id'][],
    __v: number,
}

// Unique requirements are not added because several nulls are not allowed! 
// The fix does not work.

const PersonSchema: Schema = new Schema({
    username: {
        type: String,
    },
    passwordHash: {
        type: String,
    },
    email: {
        type: String,
    },
    facebookId: {
        type: String,
    },
    facebookName: {
        type: String,
    },
    ownedItemIds: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Item'
        }
    ] 
})

const Person = mongoose.model<IPerson>('Person', PersonSchema)

export default Person


