import { RequestWithAuthorization } from '../types/authentication/RequestWithAuthorization'
import Person, { IPerson } from '../mongoose-schema/person'
import jwt from 'jsonwebtoken'
import configurations from '../utils/configurations'
import { TokenContentType } from '../types/authentication/TokenContentType'
import { ApolloError } from 'apollo-server-express'


export const authenticationGraphQL = async (request: RequestWithAuthorization): Promise<IPerson | undefined> => {

    const authentication = request.headers.authorization
    
    if (authentication) {
        const decodedToken = jwt.verify(authentication, configurations.JWT_SECRET)
        const tokenContent = decodedToken as unknown as TokenContentType
        if (!tokenContent.id || !tokenContent.username) throw new ApolloError('Authentication failed')

        const person: IPerson | null = await Person.findById(tokenContent.id)
        if (!person) throw new ApolloError('Authentication failed')
        return person
    }

    return undefined

}