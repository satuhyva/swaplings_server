import supertest from 'supertest'


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
                username, 
                facebookName
            }
        }
    `
}



