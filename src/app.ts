import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import typeDefsAndResolversCombined from './graphql-schema/typeDefsAndResolversCombined'
import Person from './mongoose-schema/person'
import Item from './mongoose-schema/item'


const app = express()
app.get('/health', (_request, response) => {
    response.send('OK')
})

const server = new ApolloServer({ 
    ...typeDefsAndResolversCombined, 

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: () => {
    // context: ({ req, res}) => {
        // console.log('CONTEXT INPUT', typeof req, typeof res)  
        // Kun playground on auki, tulee tänne koko ajan kutsuja
        // jotenkin täällä annetaan contextiin kaikki mongoosen mallit
        // jotta ne on sitten kaikkialta saatavissa ilman, että tarvitsee erikseen tuoda
        // ja ei tarvitse tuoda mongoosea, kuten alla linkissä on näytetty, lisätään vain mallit mukaan
        // eli tänne importataan ja vain lisätään alla olevaan listaan
        return { Person, Item }
        // return { req, res, Person, variaabeli }
    }
})

server.applyMiddleware({
    path: '/graphql',
    app
})




export default app