import { ChatType } from './ChatType'



export type AddPostResponseType = {
    code: string,
    success: boolean,
    message: string,
    chat: ChatType | undefined

}


