type SignUpLoginResponseCommonPartsType = {
    code: string,
    success: boolean,
    message: string,
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
            username: string | undefined, 
            facebookName: string | undefined,
        }
    }
}


