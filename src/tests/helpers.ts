import supertest from 'supertest'


export const performTestServerQuery = async (testServer: supertest.SuperTest<supertest.Test>, query: string): Promise<unknown> => {
    return await testServer
            .post('/graphql')
            .send({
                query: query
            }) 
}

export const addPersonQuery = (username: string, password: string, email?: string): string => {
    let parameters = `username: "${username}", password: "${password}"`
    if (email) {
        parameters += `, email: "${email}"`
    }
    return `
        mutation {
            addNewPerson(
                ${parameters}
            ) { id, username, email, passwordHash }
        }
    `
}

export const allPersonsInDatabaseQuery = (): string => {
    return `
        query {
            allPersonsInDatabase { id, username, email, passwordHash }
        }
    `
}