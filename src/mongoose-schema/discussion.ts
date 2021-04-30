import mongoose, { Schema, Document } from 'mongoose'



export interface IDiscussion extends Document {
    _id: string,
    itemFromId: string,
    itemToId: string,
    story: {
        content: string,
        postingPersonId: string,
        createdAt: string
    }[]
    __v: number,
}



const DiscussionSchema: Schema = new Schema({
    itemFromId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Item',
    },
    itemToId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Item',
    },
    story: [
        {
            content: { 
                type: String, 
                required: true, 
            },
        
            postingPersonId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Person',
            },
        
            createdAt: {
                type: String,
                required: true,
            }
        }
    ]
})


const Discussion = mongoose.model<IDiscussion>('Discussion', DiscussionSchema)

export default Discussion


