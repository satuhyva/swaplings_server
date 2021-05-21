import { LoginSignUpResponseType } from '../../../types/person/LoginSignUpResponseType'
import { LoginPersonInputType } from '../../../types/person/LoginPersonInputType'
import { Model } from 'mongoose'
import { IPerson } from '../../../mongoose-schema/person'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import configurations from '../../../utils/configurations'
import { TokenContentType } from '../../../types/authentication/TokenContentType'
import {  
    LOGIN_FAILED_INVALID_USERNAME_AND_OR_PASSWORD,
    LOGIN_WITH_USERNAME_AND_PASSWORD_SUCCESS
 } from '../helpers/errorMessages'




export const loginPersonService = async (loginInput: LoginPersonInputType, Person: Model<IPerson>): Promise<LoginSignUpResponseType> => {

    const { username, password } = loginInput

    let loggingInPerson: IPerson | null = null 
    loggingInPerson = await Person.findOne({ username: username})
    let passwordIsCorrect = false
    if (loggingInPerson && loggingInPerson.passwordHash) {
        passwordIsCorrect = await bcryptjs.compare(password, loggingInPerson.passwordHash)
    }
    if (!loggingInPerson || !passwordIsCorrect) {
        return {
            code: '400',
            success: false,
            message: LOGIN_FAILED_INVALID_USERNAME_AND_OR_PASSWORD,
            id: undefined,
            username: undefined, 
            facebookName: undefined, 
            jwtToken: undefined 
        }
    }

    const expiryTime = new Date()
    expiryTime.setHours(expiryTime.getHours() + 1)
    let tokenContent: TokenContentType = { id: loggingInPerson._id, expires: expiryTime.toISOString()  }
    if (loggingInPerson.username) tokenContent = { ...tokenContent, username: loggingInPerson.username }
    const token = jwt.sign(tokenContent, configurations.JWT_SECRET)

    return { 
        code: '200',
        success: true,
        message: LOGIN_WITH_USERNAME_AND_PASSWORD_SUCCESS,
        id: loggingInPerson._id,
        username: username, 
        facebookName: undefined, 
        jwtToken: token 
    }

}

