import { Model } from 'mongoose'
import { IPerson } from '../../../mongoose-schema/person'
import { IChat } from '../../../mongoose-schema/chat'
import { AddPostInputType } from '../../../types/item/AddPostInputType'
import { AddPostResponseType } from '../../../types/item/AddPostResponseType'
import { IItem } from '../../../mongoose-schema/item'
import { ChatType } from '../../../types/item/ChatType'



export const addPostService = async (
    authenticatedPerson: IPerson,
    Item: Model<IItem>,
    Chat: Model<IChat>, 
    addPostInput: AddPostInputType
    ): Promise<AddPostResponseType> => {
    
        if (!authenticatedPerson) {
            return {
                code: '401',
                success: false,
                message: 'Not authorized to post in the chat.',
                chat: undefined
            }
        }

        const { itemIdA, itemIdB, post } = addPostInput
        let item1, item2 

        try {
            item1 = await Item.findById(itemIdA)
            item2 = await Item.findById(itemIdB)
        } catch (error) {
            console.log(error)
        }
        if (!item1 || !item2) {
            return {
                code: '500',
                success: false,
                message: 'Could not find items in database.',
                chat: undefined
            }
        }        



        try {
            const newPostToAdd = {
                post: post,
                postingItemId: authenticatedPerson._id.toString() === item1.ownerPersonId.toString() ? item1._id : item2._id,
                createdAt: Date.now()            
            }

            let chat = await Chat.findOne({ itemIdA: { $in: [itemIdA, itemIdB] }, itemIdB: { $in: [itemIdA, itemIdB] } })
            if (!chat) {
                chat = new Chat({
                    itemIdA: item1._id,
                    personIdA: item1.ownerPersonId,
                    itemIdB: item2._id,
                    personIdB: item2.ownerPersonId,
                    posts: [newPostToAdd]
                })
                const createdChat = await chat.save()
                const createdChatJSON = createdChat.toJSON() as ChatType

                return {
                    code: '200',
                    success: true,
                    message: 'Successfully started chat for this match.',
                    chat: createdChatJSON
                }
            } else {
                chat.posts = [...chat.posts, newPostToAdd]
                const modifiedChat = await chat.save()
                const modifiedChatJSON = modifiedChat as ChatType
                return {
                    code: '200',
                    success: true,
                    message: 'Successfully added new post to the chat.',
                    chat: modifiedChatJSON
                }
            }
        } catch (error) {
            console.log(error)
            return {
                code: '500',
                success: false,
                message: 'Error adding post to chat.',
                chat: undefined
            }            
        }
}
