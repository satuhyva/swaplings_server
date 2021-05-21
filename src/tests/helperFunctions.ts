import supertest from 'supertest'
import Person from '../mongoose-schema/person'
import { loginPersonQuery, performTestServerQuery } from './queries'
import { LoginPersonResponseType } from './types'



export const addPersonToDatabaseAndPerformLogin = async (
    testServer: supertest.SuperTest<supertest.Test>, username: string, password: string, passwordHash: string
    ): Promise<string> => {    

    const personToAdd = new Person({ username: username, passwordHash: passwordHash })
    await personToAdd.save()
    const queryLogin = loginPersonQuery(username, password)
    const responseLogin = await performTestServerQuery(testServer, queryLogin) as Response
    const loggedInPerson = (responseLogin.body as unknown as LoginPersonResponseType).data.loginPerson
    const token = loggedInPerson.jwtToken
    if (!token) throw new Error('Token is required but it is missing.')
    return token
    
}