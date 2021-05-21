import supertest from 'supertest'
import app from '../app'
import { performAuthorizedTestServerQuery, addItemQuery, myItemsQuery } from './queries'
import { connectToMongooseDatabase } from '../../index'
import mongoose from 'mongoose'
import { clearTestDatabase } from './clearTestDatabase'
import { SUCCESS_ADD_ITEM } from '../graphql-schema/item/helpers/errorMessages'
import Person from '../mongoose-schema/person'
import { PASSWORD, PASSWORDHASH, USERNAME, TITLE, PRICE_GROUP, DESCRIPTION, BRAND, IMAGE_PUBLIC_ID, IMAGE_SECURE_URL } from './constants'
import { AddItemResponseType, MyItemsResponseType } from './types'
import { stopServer } from '../../index'
import { addPersonToDatabaseAndPerformLogin } from './helperFunctions'


const testServer = supertest(app)


describe('ITEM', () => {

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

    test('given valid item details, an item can be added to a logged in person', async () => {
        const token = await addPersonToDatabaseAndPerformLogin(testServer, USERNAME, PASSWORD, PASSWORDHASH)
        const addQuery = addItemQuery(TITLE, PRICE_GROUP, DESCRIPTION, BRAND, IMAGE_PUBLIC_ID, IMAGE_SECURE_URL)
        const responseAddItem = await performAuthorizedTestServerQuery(testServer, addQuery, token) as Response
        const addedItemResponse = responseAddItem.body as unknown as AddItemResponseType
        const addedItem = addedItemResponse.data.addItem
        expect(addedItem.code).toBe('200')
        expect(addedItem.success).toBe(true)
        expect(addedItem.message).toBe(SUCCESS_ADD_ITEM)
        expect(addedItem.item.id).toBeDefined()
        expect(addedItem.item.title).toBe(TITLE)
        expect(addedItem.item.description).toBe(DESCRIPTION)
        expect(addedItem.item.priceGroup).toBe(PRICE_GROUP)
        expect(addedItem.item.owner.id).toBeDefined()
        expect(addedItem.item.matchedTo.length).toBe(0)
        expect(addedItem.item.matchedFrom.length).toBe(0)
        expect(addedItem.item.image_public_id).toBe(IMAGE_PUBLIC_ID)
        expect(addedItem.item.image_secure_url).toBe(IMAGE_SECURE_URL)
        expect(addedItem.item.brand).toBe(BRAND)
        const person = await Person.findOne({ username: USERNAME }) as { username: string}
        expect(person.username).toBe(USERNAME)
    })

    test('given an app user, the user can get his or her (and only his or her) items', async () => {
        const token_1 = await addPersonToDatabaseAndPerformLogin(testServer, USERNAME + '_1', PASSWORD, PASSWORDHASH)
        const addItemQuery_1 = addItemQuery(TITLE + '_1', PRICE_GROUP, DESCRIPTION, BRAND, IMAGE_PUBLIC_ID, IMAGE_SECURE_URL)
        await performAuthorizedTestServerQuery(testServer, addItemQuery_1, token_1)
        const token_2 = await addPersonToDatabaseAndPerformLogin(testServer, USERNAME + '_2', PASSWORD, PASSWORDHASH)
        const addItemQuery_2A = addItemQuery(TITLE + '_2A', PRICE_GROUP, DESCRIPTION, BRAND, IMAGE_PUBLIC_ID, IMAGE_SECURE_URL)
        await performAuthorizedTestServerQuery(testServer, addItemQuery_2A, token_2)
        const addItemQuery_2B = addItemQuery(TITLE + '_2B', PRICE_GROUP, DESCRIPTION, BRAND, IMAGE_PUBLIC_ID, IMAGE_SECURE_URL)
        await performAuthorizedTestServerQuery(testServer, addItemQuery_2B, token_2)
        const queryMyItems = myItemsQuery()
        const responseMyItems = await performAuthorizedTestServerQuery(testServer, queryMyItems, token_2) as Response
        const myItems = (responseMyItems.body as unknown as MyItemsResponseType).data.myItems
        expect(myItems.length).toBe(2)
        expect(myItems[0].title).toBe(TITLE + '_2A')
        expect(myItems[1].title).toBe(TITLE + '_2B')
    })


})


