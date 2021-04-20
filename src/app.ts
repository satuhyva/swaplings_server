import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import typeDefsAndResolversCombined from './graphql-schema/typeDefsAndResolversCombined'


const app = express()

app.get('/health', (_request, response) => {
    response.send('OK')
})

const server = new ApolloServer(typeDefsAndResolversCombined)

server.applyMiddleware({
    path: '/graphql',
    app
})




export default app