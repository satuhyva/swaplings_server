import supertest from 'supertest'
import Person from '../mongoose-schema/person'
import { loginPersonQuery, performTestServerQuery } from './queries'
import { LoginPersonResponseType } from './types'
import { addItemQuery, performAuthorizedTestServerQuery, addPostQuery } from './queries'
import { PriceGroupEnum } from '../types/price-group/PriceGroupEnum'
import { AddItemResponseType } from './types'
import { AddPostResponseType } from './types'



export const loginAndGetToken = async (
    testServer: supertest.SuperTest<supertest.Test>, username: string, password: string
    ): Promise<string> => {
    const queryLogin = loginPersonQuery(username, password)
    const responseLogin = await performTestServerQuery(testServer, queryLogin) as Response
    const loggedInPerson = (responseLogin.body as unknown as LoginPersonResponseType).data.loginPerson
    const token = loggedInPerson.jwtToken
    if (!token) throw new Error('Token is required but it is missing.')
    return token
}


export const addPersonToDatabaseAndPerformLogin = async (
        testServer: supertest.SuperTest<supertest.Test>, username: string, password: string, passwordHash: string
    ): Promise<string> => {    

    const personToAdd = new Person({ username: username, passwordHash: passwordHash })
    await personToAdd.save()
    const token = await loginAndGetToken(testServer, username, password)
    // const queryLogin = loginPersonQuery(username, password)
    // const responseLogin = await performTestServerQuery(testServer, queryLogin) as Response
    // const loggedInPerson = (responseLogin.body as unknown as LoginPersonResponseType).data.loginPerson
    // const token = loggedInPerson.jwtToken
    // if (!token) throw new Error('Token is required but it is missing.')
    return token
    
}

export const addPersonAndAnItemToPerson = async (
        testServer: supertest.SuperTest<supertest.Test>, username: string, password: string, passwordHash: string,
        title: string, priceGroup: PriceGroupEnum, description: string, brand: string, imagePublicId: string, imageSecureUrl: string
    ): Promise<AddItemResponseType> => {

    const token = await addPersonToDatabaseAndPerformLogin(testServer, username, password, passwordHash)
    const addItem = addItemQuery(title, priceGroup, description, brand, imagePublicId, imageSecureUrl)
    const responseAddItem = await performAuthorizedTestServerQuery(testServer, addItem, token) as Response
    const addedItemResponse = responseAddItem.body as unknown as AddItemResponseType
    return addedItemResponse
}

export const addPostToItemsChat = async (
    testServer: supertest.SuperTest<supertest.Test>, itemIdA: string, itemIdB: string, post: string, username: string, password: string
): Promise<AddPostResponseType> => {

    const token = await loginAndGetToken(testServer, username, password)
    const addPost = addPostQuery(itemIdA, itemIdB, post) 
    const response = await performAuthorizedTestServerQuery(testServer, addPost, token) as Response
    const addPostResponse = response.body as unknown as AddPostResponseType
    return addPostResponse
}