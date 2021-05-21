import { connectToMongooseDatabase } from '../../index'
import mongoose from 'mongoose'
import { clearTestDatabase } from './clearTestDatabase'
import { LOGIN_FACEBOOK_SUCCESS, LOGIN_FACEBOOK_GRAPH_API_ERROR } from '../graphql-schema/person/helpers/errorMessages'
import fetch from 'node-fetch'
import { mocked } from 'ts-jest/utils'
import { loginPersonWithFacebookService } from '../graphql-schema/person/services/loginPersonWithFacebookService'
import Person from '../mongoose-schema/person'
import { FACEBOOK_ID, FACEBOOK_NAME, FACEBOOK_ACCESS_TOKEN } from './constants'
import { stopServer } from '../../index'


// The GraphQL queries do not work when node-fetch is mocked.
// Therefore here only the service function is tested.

jest.mock('node-fetch', () => {
    return jest.fn()
})

const setFetchMock =  (id: string, name: string): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mocked(fetch).mockImplementationOnce((): Promise<any> => {
        return Promise.resolve({
            json() {
                return Promise.resolve({ id: id, name: name })
            }
        })
    })
}




describe('FACEBOOK LOGIN / SIGNUP', () => {

    beforeAll(async () => {
        await connectToMongooseDatabase()
    })

    beforeEach(async () => {
        await clearTestDatabase()
        mocked(fetch).mockClear()
    })



    test('given valid Facebook userId and accessToken, a new person can be added to the database', async () => {
        setFetchMock(FACEBOOK_ID, FACEBOOK_NAME)
        const response = await loginPersonWithFacebookService({ userId: FACEBOOK_ID, facebookAccessToken: FACEBOOK_ACCESS_TOKEN }, Person)
        expect(response.code).toBe('200')
        expect(response.success).toBe(true)
        expect(response.message).toBe(LOGIN_FACEBOOK_SUCCESS)
        expect(response.username).toBeUndefined()
        expect(response.facebookName).toBe(FACEBOOK_NAME)
        expect(response.jwtToken).toBeDefined()
        expect(response.id).toBeDefined()
        const person = await Person.findOne({ facebookId: FACEBOOK_ID }) as { facebookName: string}
        expect(person.facebookName).toBe(FACEBOOK_NAME)
    })


    test('given valid Facebook userId and accessToken, an existing person can be found in the database', async () => {
        setFetchMock(FACEBOOK_ID, FACEBOOK_NAME)
        const personToAdd = new Person({ facebookId: FACEBOOK_ID, facebookName: FACEBOOK_NAME })
        await personToAdd.save()
        const person = await Person.findOne({ facebookId: FACEBOOK_ID }) as { facebookName: string}
        expect(person.facebookName).toBe(FACEBOOK_NAME)
        const response = await loginPersonWithFacebookService({ userId: FACEBOOK_ID, facebookAccessToken: FACEBOOK_ACCESS_TOKEN }, Person)
        expect(response.code).toBe('200')
        expect(response.success).toBe(true)
        expect(response.message).toBe(LOGIN_FACEBOOK_SUCCESS)
        expect(response.username).toBeUndefined()
        expect(response.facebookName).toBe(FACEBOOK_NAME)
        expect(response.jwtToken).toBeDefined()
        expect(response.id).toBeDefined()
    })

    test('given invalid Facebook userId, a person cannot sign up', async () => {
        setFetchMock(FACEBOOK_ID, FACEBOOK_NAME)
        const response = await loginPersonWithFacebookService({ userId: 'wrong id', facebookAccessToken: FACEBOOK_ACCESS_TOKEN }, Person)
        expect(response.code).toBe('400')
        expect(response.success).toBe(false)
        expect(response.message).toBe(LOGIN_FACEBOOK_GRAPH_API_ERROR)
        expect(response.username).toBeUndefined()
        expect(response.facebookName).toBeUndefined()
        expect(response.jwtToken).toBeUndefined()
        expect(response.id).toBeUndefined()
        const persons = await Person.find({ facebookId: FACEBOOK_ID })
        expect(persons.length).toBe(0)
    })

    test('given invalid Facebook userId, a person cannot log in', async () => {
        const personToAdd = new Person({ facebookId: FACEBOOK_ID, facebookName: FACEBOOK_NAME })
        await personToAdd.save()
        const person = await Person.findOne({ facebookId: FACEBOOK_ID }) as { facebookName: string}
        expect(person.facebookName).toBe(FACEBOOK_NAME)
        setFetchMock(FACEBOOK_ID, FACEBOOK_NAME)
        const response = await loginPersonWithFacebookService({ userId: 'wrong id', facebookAccessToken: FACEBOOK_ACCESS_TOKEN }, Person)
        expect(response.code).toBe('400')
        expect(response.success).toBe(false)
        expect(response.message).toBe(LOGIN_FACEBOOK_GRAPH_API_ERROR)
        expect(response.username).toBeUndefined()
        expect(response.facebookName).toBeUndefined()
        expect(response.jwtToken).toBeUndefined()
        expect(response.id).toBeUndefined()
    })

    afterAll(async () => {
        await mongoose.connection.close()
        stopServer()
    })

})

