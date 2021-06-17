import mongoose, { Schema, Document } from 'mongoose'
import { ChatType } from '../types/item/ChatType'


export interface IChat extends Document {
    _id: string,
    itemIdA: string,
    personIdA: string,
    itemIdB: string,
    personIdB: string,
    posts: {
        post: string,
        postingItemId: string,
        createdAt: number
    }[]
    __v: number,
}





const ChatSchema: Schema = new Schema({
    itemIdA: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Item',
    },
    personIdA: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Person',
    },    
    itemIdB: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Item',
    },
    personIdB: {
        type: Schema.Types.ObjectId,
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
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Item',
            },
        
            createdAt: {
                type: String,
                required: true,
            }
        }
    ]
},
    { 
        optimisticConcurrency: true,
        toJSON: {
            transform: function (_document, returnedObject: IChat): ChatType {
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
                        }
                    })
                }
            }
        }
    }
)






const Chat = mongoose.model<IChat>('Chat', ChatSchema)

export default Chat


