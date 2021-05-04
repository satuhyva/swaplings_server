
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import typeDefsAndResolversCombined from './graphql-schema/typeDefsAndResolversCombined'
import Person from './mongoose-schema/person'
import Item from './mongoose-schema/item'
import Discussion from './mongoose-schema/discussion'
import imageRouter from './routes/images/imageRouter'
import AddNewPersonInputDirective from './graphql-schema/validations/AddNewPersonInputDirective'
import AddNewItemToPersonInputDirective from './graphql-schema/validations/AddNewItemToPersonInputDirective'


const app = express()

app.use(express.urlencoded())



app.get('/health', (_request, response) => {
    response.send('OK')
})

app.use('/upload', imageRouter)

const server = new ApolloServer({ 
    ...typeDefsAndResolversCombined, 
    schemaDirectives: {
        personInputValidation: AddNewPersonInputDirective,
        itemInputValidation: AddNewItemToPersonInputDirective,
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: () => {
    // context: ({ req, res}) => {
        return { Person, Item, Discussion }
    }
})

server.applyMiddleware({
    path: '/graphql',
    app
})




export default app