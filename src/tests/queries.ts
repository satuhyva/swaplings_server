import supertest from 'supertest'
import { PriceGroupEnum } from '../types/price-group/PriceGroupEnum'


export const performTestServerQuery = async (testServer: supertest.SuperTest<supertest.Test>, query: string): Promise<unknown> => {
    return await testServer
            .post('/graphql')
            .send({
                query: query
            }) 
}

export const performAuthorizedTestServerQuery = async (testServer: supertest.SuperTest<supertest.Test>, query: string, token: string): Promise<unknown> => {
    return await testServer
            .post('/graphql')
            .set('authorization', token)
            .send({
                query: query
            }) 
}

export const signUpPersonQuery = (username: string, password: string, email?: string): string => {
    let parameters = `username: "${username}", password: "${password}"`
    if (email) {
        parameters += `, email: "${email}"`
    }    
    return `
        mutation {
            signUpPerson(
                signUpInput: {
                    ${parameters}
                }
            ) {  
                code,
                success,
                message,
                id,
                username, 
                facebookName,
                jwtToken
            }
        }
    `
}

export const loginPersonQuery = (username: string, password: string): string => {
    const parameters = `username: "${username}", password: "${password}"` 
    return `
        mutation {
            loginPerson(
                loginInput: {
                    ${parameters}
                }
            ) {  
                code,
                success,
                message,
                id,
                username, 
                facebookName,
                jwtToken
            }
        }
    `
}

export const removePersonQuery = (): string => {
    return `
        mutation {
            removePerson {  
                code,
                success,
                message,
                id,
                username, 
                facebookName
            }
        }
    `
}

export const addItemQuery = (
    title: string, priceGroup: PriceGroupEnum, description: string, brand?: string, image_public_id?: string, image_secure_url?: string
    ): string => {

    let parameters = `title: "${title}", priceGroup: "${priceGroup}", description: "${description}"` 
    if (brand) parameters += `, brand: "${brand}"`  
    if (image_public_id) parameters += `, image_public_id: "${image_public_id}"`  
    if (image_secure_url) parameters += `, image_secure_url: "${image_secure_url}"`  

    return `
        mutation {
            addItem(
                addItemInput: {
                    ${parameters}
                }
            ) {  
                code,
                success,
                message,
                item {
                    id
                    title
                    priceGroup
                    description
                    brand
                    image_public_id
                    image_secure_url
                    owner {
                        id
                    }
                    matchedTo {
                        id
                    }
                    matchedFrom {
                        id
                    }
                }
            }
        }
    `
}

export const myItemsQuery = (): string => {
    return `
        query {
            myItems {  
                    id
                    title
                    priceGroup
                    description
                    brand
                    image_public_id
                    image_secure_url
                    owner {
                        id
                    }
                    matchedTo {
                        id
                    }
                    matchedFrom {
                        id
                    }
            }
        }
    `
}


