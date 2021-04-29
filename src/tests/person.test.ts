import supertest from 'supertest'
import app from '../app'
const testServer = supertest(app)
import { performTestServerQuery, addPersonQuery, allPersonsInDatabaseQuery } from './helpers'
import { connectToMongooseDatabase } from '../../index'
import mongoose from 'mongoose'
import Person from '../mongoose-schema/person'



// type AddNewPersonResponseType = {
//     data: { 
//         addNewPerson: {
//             id: string,
//             username: string,
//             passwordHash: undefined,
//             email: string | null,
//             ownedItemIds: string[] | null
//         } 
//     }
// }

// type AllPersonsInDatabaseResponseType = {
//     data: { 
//         allPersonsInDatabase: {
//             id: string,
//             username: string,
//             email: string | null,
//             passwordHash: string,
//             ownedItemIds: string[] | null
//         }[] 
//     }
// }



describe('PERSON', () => {

    beforeAll(async () => {
        await connectToMongooseDatabase()
        const collections = [Person]
        const deletions = collections.map(async (collection) =>  await collection.deleteMany({}))
        await Promise.all(deletions)
    })

    test('can be created with username, password and email as input', async () => {
        const USERNAME = 'Pattern'
        const PASSWORD = 'secret'
        const EMAIL = 'pattern@gmail.com'
        const query = addPersonQuery(USERNAME, PASSWORD, EMAIL)
        const response = await performTestServerQuery(testServer, query) as Response
        // eslint-disable-next-line @typescript-eslint/unbound-method
        console.log(response.text)
        // expect(response.status).toBe(200)
        // console.log(response.body)
        // const addedPerson = (response.body as unknown as AddNewPersonResponseType).data.addNewPerson
        // expect(addedPerson.username).toBe(USERNAME)
        // expect(addedPerson.email).toBe(EMAIL)
        // expect(addedPerson.ownedItemIds).toBeNull()
        // expect(addedPerson.passwordHash).not.toBeDefined()
    })

    test('can be created with username and password as input', async () => {
        const USERNAME = 'King Elhokar'
        const PASSWORD = 'secret'
        const query = addPersonQuery(USERNAME, PASSWORD)
        const response = await performTestServerQuery(testServer, query) as Response
                // eslint-disable-next-line @typescript-eslint/unbound-method
                console.log(response.text)
        // console.log(response)
        // expect(response.status).toBe(200)
        // const addedPerson = (response.body as unknown as AddNewPersonResponseType).data.addNewPerson
        // expect(addedPerson.username).toBe(USERNAME)
        // expect(addedPerson.ownedItemIds).toBeNull()
        // expect(addedPerson.passwordHash).not.toBeDefined()
    })

    test('that was just created can be found in database', async () => {
        const USERNAME = 'Pattern'
        const PASSWORD = 'secret'
        const EMAIL = 'pattern@gmail.com'
        const queryAddPerson = addPersonQuery(USERNAME, PASSWORD, EMAIL)
        await performTestServerQuery(testServer, queryAddPerson)
        const queryAllPersonsInDatabase = allPersonsInDatabaseQuery()
        const response = await performTestServerQuery(testServer, queryAllPersonsInDatabase) as Response
        // console.log(response)
                // eslint-disable-next-line @typescript-eslint/unbound-method
                console.log(response.text)
        // expect(response.status).toBe(200)
        // console.log(response.body)
        // const personsInDatabase = (response.body as unknown as AllPersonsInDatabaseResponseType).data.allPersonsInDatabase
        // console.log(personsInDatabase)
        // TODO: nollaa persons aina alussa ennen joka testiä ja tarkista, että tulee tässä vain yksi tyyppi
        // expect(addedPerson.username).toBe(USERNAME)
        // expect(addedPerson.email).toBe(EMAIL)
    })


    test ('close the mongoose connection after all tests', async () => {
        await mongoose.connection.close()
    })

})

