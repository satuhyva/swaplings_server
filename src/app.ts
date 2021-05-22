
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import typeDefsAndResolversCombined from './graphql-schema/combine-schemas/typeDefsAndResolversCombined'
import Person from './mongoose-schema/person'
import Item from './mongoose-schema/item'
// import Discussion from './mongoose-schema/discussion'
import imageRouter from './routes/images/imageRouter'
import { authenticationGraphQL } from './utils/authenticationGraphQL'
import { IPerson } from './mongoose-schema/person'
import cors from 'cors'


const app = express()
app.use(cors())

app.use(express.urlencoded())

// TODO: Add authentication also to upload route!!!!!

app.get('/health', (_request, response) => {
    response.send('OK')
})


app.use('/upload', imageRouter)


const server = new ApolloServer({ 
    ...typeDefsAndResolversCombined, 
    context: async({ req }) => {
        const authenticatedPerson: IPerson | undefined = await authenticationGraphQL(req)
        return { 
            Person, 
            Item, 
            //Discussion, 
            authenticatedPerson 
        }
    }
})

server.applyMiddleware({
    path: '/graphql',
    app
})




export default app