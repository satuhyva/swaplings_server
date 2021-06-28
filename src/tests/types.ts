import { ItemPublicType } from '../types/item/ItemPublicType'
import { PersonDatabaseType } from '../types/person/PersonDatabaseType'
import { ChatType } from '../types/item/ChatType'


type SignUpLoginResponseCommonPartsType = {
    code: string,
    success: boolean,
    message: string,
    id: string | undefined,
    username: string | undefined, 
    facebookName: string | undefined,
    jwtToken: string | undefined
}

export type SignUpPersonResponseType = {
    data: { 
        signUpPerson: SignUpLoginResponseCommonPartsType
    }
}

export type LoginPersonResponseType = {
    data: { 
        loginPerson: SignUpLoginResponseCommonPartsType 
    }
}

export type SignUpInputValidationErrorType = {
    errors: {
        message: string
    }[]
}

export type RemovePersonResponseType = {
    data: { 
        removePerson: {
            code: string,
            success: boolean,
            message: string,
            id: string | undefined,
            username: string | undefined, 
            facebookName: string | undefined,
        }
    }
}

type ItemInResponseType = {
    id: string,
    title: string,
    priceGroup: string,
    description: string 
    owner: PersonDatabaseType,
    matchedTo: ItemPublicType[],
    matchedFrom: ItemPublicType[],
    imagePublicId?: string,
    imageSecureUrl?: string,
    brand?: string, 
}

export type AddItemResponseType = {
    data: { 
        addItem: {
            code: string,
            success: boolean,
            message: string,
            item: ItemInResponseType
        } 
    }
}

export type MyItemsResponseType = {
    data: { 
        myItems: ItemInResponseType[]
    }
}


export type AddPostResponseType = {
    data: { 
        addPost: {
            code: string,
            success: boolean,
            message: string,
            chat: ChatType
        }
    }
}


