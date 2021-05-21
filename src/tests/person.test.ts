import supertest from 'supertest'
import app from '../app'
import { 
    performTestServerQuery, 
    signUpPersonQuery,
    loginPersonQuery,
    performAuthorizedTestServerQuery,
    removePersonQuery,
} from './queries'
import { connectToMongooseDatabase } from '../../index'
import mongoose from 'mongoose'
import { clearTestDatabase } from './clearTestDatabase'
import { SIGNUP_SUCCESS, LOGIN_WITH_USERNAME_AND_PASSWORD_SUCCESS, REMOVE_PERSON_SUCCESS } from '../graphql-schema/person/helpers/errorMessages'
import {
    INVALID_USERNAME, INVALID_PASSWORD, INVALID_EMAIL
} from '../graphql-schema/custom-scalars/errorMessages'
import Person from '../mongoose-schema/person'
import { LOGIN_FAILED_INVALID_USERNAME_AND_OR_PASSWORD } from '../graphql-schema/person/helpers/errorMessages'
import {
    SignUpPersonResponseType,
    LoginPersonResponseType,
    SignUpInputValidationErrorType,
    RemovePersonResponseType
} from './types'
import { USERNAME, PASSWORD, PASSWORDHASH, EMAIL, FACEBOOK_ID, FACEBOOK_NAME } from './constants'
import jwt from 'jsonwebtoken'
import configurations from '../utils/configurations'
import { stopServer } from '../../index'


const testServer = supertest(app)




describe('PERSON', () => {

    beforeAll(async () => {
        await connectToMongooseDatabase()
    })

    beforeEach(async () => {
        await clearTestDatabase()
    })


    afterAll(async () => {
        await mongoose.connection.close()
        stopServer()
    })

    
    test('given proper username, password and email, person can sign up', async () => {
        const query = signUpPersonQuery(USERNAME, PASSWORD, EMAIL)
        const response = await performTestServerQuery(testServer, query) as Response
        expect(response.status).toBe(200)
        const signedUpPerson = (response.body as unknown as SignUpPersonResponseType).data.signUpPerson
        expect(signedUpPerson.code).toBe('200')
        expect(signedUpPerson.success).toBe(true)
        expect(signedUpPerson.message).toBe(SIGNUP_SUCCESS)
        expect(signedUpPerson.username).toBe(USERNAME)
        expect(signedUpPerson.facebookName).toBeNull()
        expect(signedUpPerson.jwtToken).toBeDefined()
        expect(signedUpPerson.id).toBeDefined()
        const person = await Person.findOne({ username: USERNAME }) as { username: string}
        expect(person.username).toBe(USERNAME)
    })

    test('given proper username and password (but no email), person can sign up', async () => {
        const query = signUpPersonQuery(USERNAME, PASSWORD)
        const response = await performTestServerQuery(testServer, query) as Response
        expect(response.status).toBe(200)
        const signedUpPerson = (response.body as unknown as SignUpPersonResponseType).data.signUpPerson
        expect(signedUpPerson.code).toBe('200')
        expect(signedUpPerson.success).toBe(true)
        expect(signedUpPerson.message).toBe(SIGNUP_SUCCESS)
        expect(signedUpPerson.username).toBe(USERNAME)
        expect(signedUpPerson.facebookName).toBeNull()
        expect(signedUpPerson.jwtToken).toBeDefined()
        expect(signedUpPerson.id).toBeDefined()
        const person = await Person.findOne({ username: USERNAME }) as { username: string}
        expect(person.username).toBe(USERNAME)
    })

    test('given invalid (too short) username, a person cannot sign up', async () => {
        const query = signUpPersonQuery('u', PASSWORD, EMAIL)
        const response = await performTestServerQuery(testServer, query) as Response
        expect(response.status).toBe(400)
        const error = (response.body as unknown as SignUpInputValidationErrorType).errors[0].message
        expect(error).toContain(INVALID_USERNAME)
    })

    test('given invalid (too long) username, a person cannot sign up', async () => {
        const query = signUpPersonQuery('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', PASSWORD, EMAIL)
        const response = await performTestServerQuery(testServer, query) as Response
        expect(response.status).toBe(400)
        const error = (response.body as unknown as SignUpInputValidationErrorType).errors[0].message
        expect(error).toContain(INVALID_USERNAME)
    })

    test('given invalid (too short) password, a person cannot sign up', async () => {
        const query = signUpPersonQuery(USERNAME, '1234567', EMAIL)
        const response = await performTestServerQuery(testServer, query) as Response
        expect(response.status).toBe(400)
        const error = (response.body as unknown as SignUpInputValidationErrorType).errors[0].message
        expect(error).toContain(INVALID_PASSWORD)
    })

    test('given invalid (too long) password, a person cannot sign up', async () => {
        const query = signUpPersonQuery(USERNAME, 'sssssssssssssssssssssssssssssssssssssssssssssss', EMAIL)
        const response = await performTestServerQuery(testServer, query) as Response
        expect(response.status).toBe(400)
        const error = (response.body as unknown as SignUpInputValidationErrorType).errors[0].message
        expect(error).toContain(INVALID_PASSWORD)
    })

    test('given invalid email, a person cannot sign up', async () => {
        const query = signUpPersonQuery(USERNAME, PASSWORD, 'shallan.davar.gmail.com')
        const response = await performTestServerQuery(testServer, query) as Response
        expect(response.status).toBe(400)
        const error = (response.body as unknown as SignUpInputValidationErrorType).errors[0].message
        expect(error).toContain(INVALID_EMAIL)
    })

    test('given valid username and password, a person can login', async () => {
        const personToAdd = new Person({ username: USERNAME, passwordHash: PASSWORDHASH })
        await personToAdd.save()
        const query = loginPersonQuery(USERNAME, PASSWORD)
        const response = await performTestServerQuery(testServer, query) as Response
        expect(response.status).toBe(200)
        const loggedInPerson = (response.body as unknown as LoginPersonResponseType).data.loginPerson
        expect(loggedInPerson.code).toBe('200')
        expect(loggedInPerson.success).toBe(true)
        expect(loggedInPerson.message).toBe(LOGIN_WITH_USERNAME_AND_PASSWORD_SUCCESS)
        expect(loggedInPerson.username).toBe(USERNAME)
        expect(loggedInPerson.facebookName).toBeNull()
        expect(loggedInPerson.jwtToken).toBeDefined()
        expect(loggedInPerson.id).toBeDefined()
        const person = await Person.findOne({ username: USERNAME }) as { username: string}
        expect(person.username).toBe(USERNAME)
    })

    test('given invalid username, a person cannot login', async () => {
        const personToAdd = new Person({ username: USERNAME, passwordHash: PASSWORDHASH })
        await personToAdd.save()
        const person = await Person.findOne({ username: USERNAME }) as { username: string}
        expect(person.username).toBe(USERNAME)        
        const query = loginPersonQuery('invalid username', PASSWORD)
        const response = await performTestServerQuery(testServer, query) as Response
        const responseData = (response.body as unknown as LoginPersonResponseType).data.loginPerson
        expect(responseData.code).toBe('400')
        expect(responseData.success).toBe(false)
        expect(responseData.message).toBe(LOGIN_FAILED_INVALID_USERNAME_AND_OR_PASSWORD)
        expect(responseData.username).toBeNull()
        expect(responseData.facebookName).toBeNull()
        expect(responseData.jwtToken).toBeNull()
        expect(responseData.id).toBeNull()
    })

    test('given invalid password, a person cannot login', async () => {
        const personToAdd = new Person({ username: USERNAME, passwordHash: PASSWORDHASH })
        await personToAdd.save()
        const person = await Person.findOne({ username: USERNAME }) as { username: string}
        expect(person.username).toBe(USERNAME)        
        const query = loginPersonQuery(USERNAME, 'invalid password')
        const response = await performTestServerQuery(testServer, query) as Response
        const responseData = (response.body as unknown as LoginPersonResponseType).data.loginPerson
        expect(responseData.code).toBe('400')
        expect(responseData.success).toBe(false)
        expect(responseData.message).toBe(LOGIN_FAILED_INVALID_USERNAME_AND_OR_PASSWORD)
        expect(responseData.username).toBeNull()
        expect(responseData.facebookName).toBeNull()
        expect(responseData.jwtToken).toBeNull()
        expect(responseData.id).toBeNull()
    })

    test('given person is authorized, person can remove him or herself from database (username)', async () => {
        const personToAdd = new Person({ username: USERNAME, passwordHash: PASSWORDHASH })
        await personToAdd.save()
        const personsBefore = await Person.find({ username: USERNAME })
        expect(personsBefore.length).toBe(1)
        const queryLogin = loginPersonQuery(USERNAME, PASSWORD)
        const responseLogin = await performTestServerQuery(testServer, queryLogin) as Response
        const responseLoginData = (responseLogin.body as unknown as LoginPersonResponseType).data.loginPerson
        const token = responseLoginData.jwtToken as string
        const queryRemove = removePersonQuery()
        const responseRemove = await performAuthorizedTestServerQuery(testServer, queryRemove, token) as Response
        const responseRemoveData = (responseRemove.body as unknown as RemovePersonResponseType).data.removePerson
        expect(responseRemoveData.code).toBe('200')
        expect(responseRemoveData.success).toBe(true)
        expect(responseRemoveData.message).toBe(REMOVE_PERSON_SUCCESS)
        expect(responseRemoveData.username).toBe(USERNAME)
        expect(responseRemoveData.facebookName).toBeNull()
        expect(responseRemoveData.id).toBeDefined()
        const personsAfter = await Person.find({ username: USERNAME })
        expect(personsAfter.length).toBe(0)
    })


    test('given person is authorized, person can remove him or herself from database (facebook name)', async () => {
        const personToAdd = new Person({ facebookId: FACEBOOK_ID, facebookName: FACEBOOK_NAME })
        const createdPerson = await personToAdd.save()
        // Token is artificially created here because mocking node-fetch does not work with GraphQL queries.
        const expiryTime = new Date()
        expiryTime.setHours(expiryTime.getHours() + 1)
        const JWT_TOKEN_FACEBOOK = jwt.sign({ id: createdPerson._id, facebookName: FACEBOOK_NAME, expires: expiryTime.toISOString() }, configurations.JWT_SECRET)
        const personsBefore = await Person.find({ facebookId: FACEBOOK_ID })
        expect(personsBefore.length).toBe(1)
        const queryRemove = removePersonQuery()
        const responseRemove = await performAuthorizedTestServerQuery(testServer, queryRemove, JWT_TOKEN_FACEBOOK) as Response
        const responseRemoveData = (responseRemove.body as unknown as RemovePersonResponseType).data.removePerson
        expect(responseRemoveData.code).toBe('200')
        expect(responseRemoveData.success).toBe(true)
        expect(responseRemoveData.message).toBe(REMOVE_PERSON_SUCCESS)
        expect(responseRemoveData.username).toBeNull()
        expect(responseRemoveData.facebookName).toBe(FACEBOOK_NAME)
        expect(responseRemoveData.id).toBeDefined()
        const personsAfter = await Person.find({ facebookId: FACEBOOK_ID })
        expect(personsAfter.length).toBe(0)
    })


})

