import { ItemPublicType } from '../types/item/ItemPublicType'
import { PersonDatabaseType } from '../types/person/PersonDatabaseType'


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
    image_public_id?: string,
    image_secure_url?: string,
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


