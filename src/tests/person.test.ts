import supertest from 'supertest'
import app from '../app'
import { performTestServerQuery, addPersonQuery, 
    // allPersonsInDatabaseQuery, privatePersonByUsername 
} from './queries'
import { connectToMongooseDatabase } from '../../index'
import mongoose from 'mongoose'
import { clearTestDatabase } from './clearTestDatabase'
import { INVALID_USERNAME, INVALID_PASSWORD, INVALID_EMAIL } from '../graphql-schema/custom-scalars/errorMessages'

const testServer = supertest(app)


type AddNewPersonResponseType = {
    data: { 
        addNewPerson: {
            id: string,
            username: string,
            email: string | null,
            ownedItems: []
        } 
    }
}

// type AllPersonsInDatabaseResponseType = {
//     data: { 
//         allPersonsInDatabase: {
//             id: string,
//             username: string,
//             email: string | null,
//             passwordHash: string,
//             ownedItems: []
//         }[] 
//     }
// }



describe('PERSON', () => {

    beforeAll(async () => {
        await connectToMongooseDatabase()
    })

    beforeEach(async () => {
        await clearTestDatabase()
    })


    test('can be created with username, password and email as input', async () => {
        const USERNAME = 'Shallan Davar'
        const PASSWORD = 'secretsecret'
        const EMAIL = 'shallan.davar@gmail.com'
        const query = addPersonQuery(USERNAME, PASSWORD, EMAIL)
        const response = await performTestServerQuery(testServer, query) as Response
        expect(response.status).toBe(200)
        const addedPerson = (response.body as unknown as AddNewPersonResponseType).data.addNewPerson
        expect(addedPerson.username).toBe(USERNAME)
        expect(addedPerson.email).toBe(EMAIL)
        expect(addedPerson.ownedItems.length).toBe(0)
    })

    test('can be created with username and password as input', async () => {
        const USERNAME = 'King Elhokar'
        const PASSWORD = 'secretsecret'
        const query = addPersonQuery(USERNAME, PASSWORD)
        const response = await performTestServerQuery(testServer, query) as Response
        expect(response.status).toBe(200)
        const addedPerson = (response.body as unknown as AddNewPersonResponseType).data.addNewPerson
        expect(addedPerson.username).toBe(USERNAME)
        expect(addedPerson.ownedItems.length).toBe(0)
        expect(addedPerson.email).toBeNull()
    })

    test('cannot be created with invalid (too short) username', async () => {
        const USERNAME = '1'
        const PASSWORD = 'secretsecret'
        const query = addPersonQuery(USERNAME, PASSWORD)
        const response = await performTestServerQuery(testServer, query) as Response
        expect(response.text.toString().includes(INVALID_USERNAME))
    })

    test('cannot be created with invalid (too long) username', async () => {
        const USERNAME = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        const PASSWORD = 'secretsecret'
        const query = addPersonQuery(USERNAME, PASSWORD)
        const response = await performTestServerQuery(testServer, query) as Response
        expect(response.text.toString().includes(INVALID_USERNAME))
    })

    test('cannot be created with invalid (too short) password', async () => {
        const USERNAME = 'Shallan Davar'
        const PASSWORD = 'secretsecret'
        const query = addPersonQuery(USERNAME, PASSWORD)
        const response = await performTestServerQuery(testServer, query) as Response
        expect(response.text.toString().includes(INVALID_PASSWORD))
    })

    test('cannot be created with invalid (too long) password', async () => {
        const USERNAME = 'Shallan Davar'
        const PASSWORD = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        const query = addPersonQuery(USERNAME, PASSWORD)
        const response = await performTestServerQuery(testServer, query) as Response
        expect(response.text.toString().includes(INVALID_PASSWORD))
    })

    test('cannot be created with invalid email', async () => {
        const USERNAME = 'Shallan Davar'
        const PASSWORD = 'secretsecret'
        const EMAIL = 'shallan.davarmail.com'
        const query = addPersonQuery(USERNAME, PASSWORD, EMAIL)
        const response = await performTestServerQuery(testServer, query) as Response
        expect(response.text.toString().includes(INVALID_EMAIL))
    })

    // test('that was just created can be found in database (query all persons in database)', async () => {
    //     const USERNAME = 'Jasnah Kholin'
    //     const PASSWORD = 'secretsecret'
    //     const EMAIL = 'jasnah.kholin@gmail.com'
    //     const queryAddPerson = addPersonQuery(USERNAME, PASSWORD, EMAIL)
    //     await performTestServerQuery(testServer, queryAddPerson)
    //     const queryAllPersonsInDatabase = allPersonsInDatabaseQuery()
    //     const response = await performTestServerQuery(testServer, queryAllPersonsInDatabase) as Response
    //     expect(response.status).toBe(200)
    //     const personsInDatabase = (response.body as unknown as AllPersonsInDatabaseResponseType).data.allPersonsInDatabase
    //     expect(personsInDatabase.length).toBe(1)
    //     expect(personsInDatabase[0].username).toBe(USERNAME)
    //     expect(personsInDatabase[0].passwordHash).toBeDefined()
    //     expect(personsInDatabase[0].email).toBe(EMAIL)
    //     expect(personsInDatabase[0].ownedItems.length).toBe(0)
    // })

    // test('that was created can be found in database (query one user by username)', async () => {
    //     const USERNAME = 'Shallan Davar'
    //     const PASSWORD = 'secretsecret'
    //     const EMAIL = 'shallan.davar@gmail.com'
    //     const queryCreatePerson = addPersonQuery(USERNAME, PASSWORD, EMAIL)
    //     await performTestServerQuery(testServer, queryCreatePerson)
    //     const queryAddedPerson = privatePersonByUsername(USERNAME)
    //     const response = await performTestServerQuery(testServer, queryAddedPerson) as Response
    //     expect(response.text.toString().includes(USERNAME))
    //     expect(response.text.toString().includes(EMAIL))
    // })

    afterAll(async () => {
        await mongoose.connection.close()
    })

})

