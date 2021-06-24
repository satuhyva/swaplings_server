import app from './src/app'
import configurations from './src/utils/configurations'
import mongoose from 'mongoose'
import { Server } from 'node:http'
import { clearTestDatabase } from './src/tests/clearTestDatabase'


export const connectToMongooseDatabase = async (): Promise<void> => {
    mongoose.set('useFindAndModify', false)
    mongoose.set('useCreateIndex', true)

    try {
        await mongoose.connect(configurations.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        if (process.env.NODE_ENV !== 'test') {
            console.log('Connected to MongoDB')
        }
        if (process.env.E2E === 'e2e') {
            await clearTestDatabase()
            console.log('Cleared test database for E2E testing')
        }
        if (process.env.DEV === 'dev') {
            await clearTestDatabase()
            console.log('Cleared test database for running in development mode')
        }
    } catch (error) {
        console.log('Error in connecting to MongoDB:', error)
    }
}

let server: Server

const startServer = () => {
    try {
        server = app.listen({ port: configurations.PORT }, () => {
            if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'production') {
                console.log('Swaplings server ready at PORT', configurations.PORT)
            }
        })
    } catch (error) {
        console.log('Error in starting the server', error)
    }
}



const connectToDatabaseAndStartServer = async () => {
    await connectToMongooseDatabase()
    startServer()
}

export const stopServer = (): void => {
    server.close()
}


void connectToDatabaseAndStartServer()