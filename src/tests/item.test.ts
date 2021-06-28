import supertest from 'supertest'
import app from '../app'
import { performAuthorizedTestServerQuery, loginPersonQuery, myItemsQuery, performTestServerQuery  } from './queries'
import { connectToMongooseDatabase } from '../../index'
import mongoose from 'mongoose'
import { clearTestDatabase } from './clearTestDatabase'
import { SUCCESS_ADD_ITEM } from '../graphql-schema/item/helpers/errorMessages'
import Person from '../mongoose-schema/person'
import { PASSWORD, PASSWORDHASH, USERNAME, TITLE, PRICE_GROUP, DESCRIPTION, BRAND, IMAGE_PUBLIC_ID, IMAGE_SECURE_URL, POST } from './constants'
import {  LoginPersonResponseType, MyItemsResponseType } from './types'
import { stopServer } from '../../index'
import {  addPersonAndAnItemToPerson, addPostToItemsChat } from './helperFunctions'


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
        const addedItemResponse = await addPersonAndAnItemToPerson(testServer, USERNAME, PASSWORD, PASSWORDHASH, TITLE, PRICE_GROUP, DESCRIPTION, BRAND, IMAGE_PUBLIC_ID, IMAGE_SECURE_URL)
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
        expect(addedItem.item.imagePublicId).toBe(IMAGE_PUBLIC_ID)
        expect(addedItem.item.imageSecureUrl).toBe(IMAGE_SECURE_URL)
        expect(addedItem.item.brand).toBe(BRAND)
        const person = await Person.findOne({ username: USERNAME }) as { username: string}
        expect(person.username).toBe(USERNAME)
    })

    test('given an app user, the user can get his or her (and only his or her) items', async () => {
        await addPersonAndAnItemToPerson(testServer, USERNAME + '_1', PASSWORD, PASSWORDHASH, TITLE + '_1', PRICE_GROUP, DESCRIPTION, BRAND, IMAGE_PUBLIC_ID, IMAGE_SECURE_URL)
        await addPersonAndAnItemToPerson(testServer, USERNAME + '_2', PASSWORD, PASSWORDHASH, TITLE + '_2A', PRICE_GROUP, DESCRIPTION, BRAND, IMAGE_PUBLIC_ID, IMAGE_SECURE_URL)
        await addPersonAndAnItemToPerson(testServer, USERNAME + '_2', PASSWORD, PASSWORDHASH, TITLE + '_2B', PRICE_GROUP, DESCRIPTION, BRAND, IMAGE_PUBLIC_ID, IMAGE_SECURE_URL)
        
        const queryLogin = loginPersonQuery(USERNAME + '_2', PASSWORD)
        const responseLogin = await performTestServerQuery(testServer, queryLogin) as Response
        const loggedInPerson = (responseLogin.body as unknown as LoginPersonResponseType).data.loginPerson
        const token = loggedInPerson.jwtToken
        if (!token) throw new Error('Token is required but it is missing.')
        const queryMyItems = myItemsQuery()
        const responseMyItems = await performAuthorizedTestServerQuery(testServer, queryMyItems, token) as Response
        const myItems = (responseMyItems.body as unknown as MyItemsResponseType).data.myItems
        expect(myItems.length).toBe(2)
        expect(myItems[0].title).toBe(TITLE + '_2A')
        expect(myItems[1].title).toBe(TITLE + '_2B')
    })

    test('given a matched pair of items, posts can be added to a chat for this match', async () => {
        const user_1 = USERNAME + '_1'
        const user_2 = USERNAME + '_2'
        const addedItem1Response = await addPersonAndAnItemToPerson(testServer, user_1, PASSWORD, PASSWORDHASH, TITLE + '_1', PRICE_GROUP, DESCRIPTION, BRAND, IMAGE_PUBLIC_ID, IMAGE_SECURE_URL)
        const addedItem1Id = addedItem1Response.data.addItem.item.id
        const addedItem2Response = await addPersonAndAnItemToPerson(testServer, user_2, PASSWORD, PASSWORDHASH, TITLE + '_2', PRICE_GROUP, DESCRIPTION, BRAND, IMAGE_PUBLIC_ID, IMAGE_SECURE_URL)
        const addedItem2Id = addedItem2Response.data.addItem.item.id
        const post1Result = await addPostToItemsChat(testServer, addedItem1Id, addedItem2Id, POST + ' by _1', user_1, PASSWORD)
        const chat_first = post1Result.data.addPost.chat
        expect(chat_first.posts.length).toBe(1)
        const post2Result = await addPostToItemsChat(testServer, addedItem1Id, addedItem2Id, POST + ' by _1', user_1, PASSWORD)
        const chat_second = post2Result.data.addPost.chat
        expect(chat_second.posts.length).toBe(2)
        const post3Result = await addPostToItemsChat(testServer, addedItem2Id, addedItem1Id, POST + ' by _2', user_2, PASSWORD)
        const chat_third = post3Result.data.addPost.chat
        expect(chat_third.posts.length).toBe(3)
    })


})


