import supertest from 'supertest'


export const performTestServerQuery = async (testServer: supertest.SuperTest<supertest.Test>, query: string): Promise<unknown> => {
    return await testServer
            .post('/graphql')
            .send({
                query: query
            }) 
}

export const addPersonQuery = (username?: string, password?: string, email?: string, facebookAccessToken?: string): string => {
    let parameters = ''
    if (username && password) {
        parameters += `username: "${username}", password: "${password}"`
        if (email) {
            parameters += `, email: "${email}"`
        }
    } else if (facebookAccessToken) {
        parameters += `facebookAccessToken: "${facebookAccessToken}"`
    }

    return `
        mutation {
            signUpPerson(
                personInput: {
                    ${parameters}
                }
            ) {  
                username, 
                facebookName,
                jwtToken
            }
        }
    `
}

// export const allPersonsInDatabaseQuery = (): string => {
//     return `
//         query {
//             allPersonsInDatabase { 
//                 id, 
//                 username, 
//                 email, 
//                 passwordHash, 
//                 ownedItems {
//                     title
//                 }
//             }
//         }
//     `
// }

// export const privatePersonByUsername = (username: string): string => {
//     const parameters = `username: "${username}"`
//     return `
//         query {
//             privatePersonByUsername(${parameters}) {
//                 username,
//                 email
//             }
//         }
// `
// }

// export const addNewItemToPersonQuery = (username: string, title: string, priceGroup: string, description: string): string => {
//     const parameters = `username: "${username}", title: "${title}", priceGroup: "${priceGroup}", description: "${description}"`
//     return `
//         mutation {
//             addNewItemToPerson(
//                 itemInput: {
//                     ${parameters}
//                 }
//             ) { 
//                 id, 
//                 title, 
//                 priceGroup,
//                 description
//             }
//         }
//     `
// }
