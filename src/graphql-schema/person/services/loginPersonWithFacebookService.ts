import { LoginSignUpResponseType } from '../../../types/person/LoginSignUpResponseType'
import { Model } from 'mongoose'
import { IPerson } from '../../../mongoose-schema/person'
import jwt from 'jsonwebtoken'
import configurations from '../../../utils/configurations'
import { TokenContentType } from '../../../types/authentication/TokenContentType'
import { LOGIN_FACEBOOK_DATABASE_ERROR, LOGIN_FACEBOOK_GRAPH_API_ERROR, LOGIN_FACEBOOK_SUCCESS } from '../helpers/errorMessages'
import { FacebookInputType } from '../../../types/person/FacebookInputType'
import fetch from 'node-fetch'


export type FacebookGraphAPIResponseType = {
    id: string, 
    name: string
}

const fetchPersonDataFromFacebookGraphAPI = async (userId: string, facebookAccessToken: string): Promise<FacebookGraphAPIResponseType | undefined> => {
    const url = `https://graph.facebook.com/${userId}?fields=id,name&access_token=${facebookAccessToken}`
    const response = await fetch(url)
    const responseJSON = await response.json() as FacebookGraphAPIResponseType
    if (responseJSON.id && responseJSON.name && responseJSON.id === userId) {
        return responseJSON
    } else return undefined
}



export const loginPersonWithFacebookService = async (facebookLoginInput: FacebookInputType,  Person: Model<IPerson>  ): Promise<LoginSignUpResponseType> => {

    const { userId, facebookAccessToken } = facebookLoginInput
    let personData: { id: string, name: string } | undefined = undefined
    try {
        const facebookResponseData = await fetchPersonDataFromFacebookGraphAPI(userId, facebookAccessToken)
        if (facebookResponseData) personData = facebookResponseData
        else throw new Error()
    } catch (error) {
        return {
            code: '400',
            success: false,
            message: LOGIN_FACEBOOK_GRAPH_API_ERROR,
            id: undefined,
            username: undefined, 
            facebookName: undefined, 
            jwtToken: undefined 
        }
    }


    let loggingInPerson: IPerson | null = null 
    try {
        const persons: IPerson[] = await Person.find({ facebookId: personData.id })
        if (persons.length === 0) {
            const personToAdd = new Person({ facebookId: personData.id, facebookName: personData.name })
            loggingInPerson = await personToAdd.save()
        } else {
            loggingInPerson = persons[0]
        }
        if (!loggingInPerson) throw new Error()
    } catch (error) {
        return {
            code: '400',
            success: false,
            message: LOGIN_FACEBOOK_DATABASE_ERROR,
            id: undefined,
            username: undefined, 
            facebookName: undefined, 
            jwtToken: undefined 
        }
    }

    const expiryTime = new Date()
    expiryTime.setHours(expiryTime.getHours() + 1)
    let tokenContent: TokenContentType = { id: loggingInPerson._id, expires: expiryTime.toISOString() }
    if (loggingInPerson.facebookName) tokenContent = { ...tokenContent, facebookName: personData.name }
    const token = jwt.sign(tokenContent, configurations.JWT_SECRET)

    return { 
        code: '200',
        success: true,
        message: LOGIN_FACEBOOK_SUCCESS,
        id: loggingInPerson._id,
        facebookName: personData.name, 
        jwtToken: token 
    }

}