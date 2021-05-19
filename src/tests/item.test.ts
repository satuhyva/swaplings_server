import supertest from 'supertest'
import app from '../app'
import { performTestServerQuery, addPersonQuery, addNewItemToPersonQuery } from './queries'
import { connectToMongooseDatabase } from '../../index'
import mongoose from 'mongoose'
import { clearTestDatabase } from './clearTestDatabase'
// import { INVALID_USERNAME, INVALID_PASSWORD, INVALID_EMAIL } from '../graphql-schema/validations/errorMessages'
import { PriceGroupEnum } from '../types/price-group/PriceGroupEnum'

const testServer = supertest(app)
const USERNAME = 'Shallan Davar'
const PASSWORD = 'secretsecret'
const EMAIL = 'shallan.davar@gmail.com'
const TITLE = 'Some item name'
const PRICE_GROUP = PriceGroupEnum.GROUP_1
const DESCRIPTION = 'Description of the item.'


type AddNewItemToPersonResponseType = {
    data: { 
        addNewItemToPerson: {
            id: string,
            title: string,
            priceGroup: string,
            description: string
        } 
    }
}


describe('ITEM', () => {

    beforeAll(async () => {
        await connectToMongooseDatabase()
    })

    beforeEach(async () => {
        await clearTestDatabase()
        const queryAddPerson = addPersonQuery(USERNAME, PASSWORD, EMAIL)
        await performTestServerQuery(testServer, queryAddPerson)
    })


    test('can be added to a person', async () => {
        const query = addNewItemToPersonQuery(USERNAME, TITLE, PRICE_GROUP, DESCRIPTION)
        const response = await performTestServerQuery(testServer, query) as Response
        const addedItem = (response.body as unknown as AddNewItemToPersonResponseType).data.addNewItemToPerson
        expect(addedItem.id).toBeDefined()
        expect(addedItem.title).toBe(TITLE)
        expect(addedItem.priceGroup).toBe(PRICE_GROUP)
        expect(addedItem.description).toBe(DESCRIPTION)
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

})
