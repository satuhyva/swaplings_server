import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import typeDefsAndResolversCombined from './graphql-schema/typeDefsAndResolversCombined'



const app = express()
app.get('/health', (_request, response) => {
    response.send('OK')
})

const server = new ApolloServer({ 
    ...typeDefsAndResolversCombined, 
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // context: ({ req, res}) => {
    //     // Kun playground on auki, tulee tänne koko ajan kutsuja
    //     console.log('CONTEXT INPUT', typeof req, typeof res)
    //     // jotenkin täällä annetaan contextiin kaikki mongoosen mallit
    //     // jotta ne on sitten kaikkialta saatavissa ilman, että tarvitsee erikseen tuoda
    //     // ja ei tarvitse tuoda mongoosea
    // }
})

server.applyMiddleware({
    path: '/graphql',
    app
})

// https://stackoverflow.com/questions/62968788/get-model-from-context-vs-import-apollo-server-express-mongoose
// tuodaan kaikki mongoose modelit contextissa, niin riittää tuoda kerran!



export default app