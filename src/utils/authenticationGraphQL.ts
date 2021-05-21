import { RequestWithAuthorization } from '../types/authentication/RequestWithAuthorization'
import Person, { IPerson } from '../mongoose-schema/person'
import jwt from 'jsonwebtoken'
import configurations from '../utils/configurations'
import { TokenContentType } from '../types/authentication/TokenContentType'
import { ApolloError } from 'apollo-server-express'


export const AUTHENTICATION_FAILED = 'Authentication failed. Could not find person in database.'


export const authenticationGraphQL = async (request: RequestWithAuthorization): Promise<IPerson | undefined> => {

    const authentication = request.headers.authorization
    
    if (authentication) {
        const decodedToken = jwt.verify(authentication, configurations.JWT_SECRET)
        const tokenContent = decodedToken as unknown as TokenContentType
        const hasNotExpired = !!tokenContent.expires && new Date(tokenContent.expires) > new Date()
        if (hasNotExpired && !tokenContent.id || (!tokenContent.username && !tokenContent.facebookName)) throw new ApolloError(AUTHENTICATION_FAILED)

        const person: IPerson | null = await Person.findById(tokenContent.id)
        if (!person) throw new ApolloError(AUTHENTICATION_FAILED)
        return person
    }

    return undefined
}