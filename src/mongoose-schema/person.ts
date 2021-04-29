import mongoose, { Schema, Document } from 'mongoose'
import { IItem } from './item'

//https://tomanagle.medium.com/strongly-typed-models-with-mongoose-and-typescript-7bc2f7197722


export interface IPerson extends Document {
    _id: string,
    username: string,
    passwordHash: string,
    email: string | null,
    ownedItemIds: IItem['_id'][],
    __v: number,
}


const PersonSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true
    },
    email: {
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


