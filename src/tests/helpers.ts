import supertest from 'supertest'


export const performTestServerQuery = async (testServer: supertest.SuperTest<supertest.Test>, query: string): Promise<unknown> => {
    return await testServer
            .post('/graphql')
            .send({
                query: query
            }) 
}