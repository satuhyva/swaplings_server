import { Model } from 'mongoose'
import { IPerson } from '../../mongoose-schema/person'
import { SignUpPersonInputType } from '../../types/person/SignUpPersonInputType'
import bcryptjs from 'bcryptjs'
import { LoginSignUpResponseType } from '../../types/person/LoginSignUpResponseType'
import { MongoError } from 'mongodb'
import jwt from 'jsonwebtoken'
import configurations from '../../utils/configurations'
import { TokenContentType } from '../../types/authentication/TokenContentType'
import { 
    SIGNUP_EMAIL_ALREADY_IN_USE,
    SIGNUP_SUCCESS,
    SIGNUP_USERNAME_ALREADY_IN_USE,
    SIGNUP_ERROR_DATABASE
 } from './errorMessages'



export const signUpPersonService = async (
    Person: Model<IPerson>, 
    personInput: SignUpPersonInputType
    ): Promise<LoginSignUpResponseType> => {

    const { username, password, email } = personInput

    if (email) {
        const existingPersonWithEmail = await Person.find({ email: email })
        if (existingPersonWithEmail.length > 0) {
            return {
                code: '400',
                success: false,
                message: SIGNUP_EMAIL_ALREADY_IN_USE,
                username: undefined, 
                facebookName: undefined, 
                jwtToken: undefined 
            }
        }
    }

    const salt = bcryptjs.genSaltSync(10)
    const passwordHash = bcryptjs.hashSync(password, salt)

    let signingUpPerson: IPerson | undefined = undefined
    try {
        let personData: { username: string, passwordHash: string, email?: string } = { username: username, passwordHash: passwordHash }
        if (email) personData = { ...personData, email: email }
        const personToAdd = new Person(personData)
        signingUpPerson = await personToAdd.save()
        if (!signingUpPerson) throw new Error()
    } catch (error) {
        let message = SIGNUP_ERROR_DATABASE
        if ((error as MongoError).message.includes('duplicate key')) {
            message = SIGNUP_USERNAME_ALREADY_IN_USE
        }
        return {
            code: '400',
            success: false,
            message: message,
            username: undefined, 
            facebookName: undefined, 
            jwtToken: undefined 
        }
        
    }

    let tokenContent: TokenContentType = { id: signingUpPerson._id }
    if (signingUpPerson.username) tokenContent = { ...tokenContent, username: signingUpPerson.username }
    const token = jwt.sign(tokenContent, configurations.JWT_SECRET)
        
    return { 
        code: '200',
        success: true,
        message: SIGNUP_SUCCESS,
        username: username, 
        facebookName: undefined, 
        jwtToken: token 
    }
}