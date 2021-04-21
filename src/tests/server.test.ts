import supertest from 'supertest'
import app from '../app'
const testServer = supertest(app)
import { performTestServerQuery } from './helpers'



describe('SERVER', () => {

    test('can be started and a REST GET request to "/health" results in an "OK" response', async () => {
        const response = await testServer
            .get('/health')
            .send()
        expect(response.status).toBe(200)
        expect(response.text).toBe('OK')
    })

    test('can be started and a GraphQL QUERY "health" results in an "OK" response', async () => {
        const query = `
                query {
                    health
                }
            `
        const response = await performTestServerQuery(testServer, query) as Response
        expect(response.status).toBe(200)
        type ResponseType = { data: { health: string } }
        expect((response.body as unknown as ResponseType).data.health).toBe('OK')
    })

//     test('Unknown endpoint returns unknown endpoint', async () => {
//       const response = await server
//           .get('/someunknownendpoint')
//           .send()
//       expect(response.status).toBe(404)
//       expect(response.text).toContain('UNKNOWN ENDPOINT')
//   })


})