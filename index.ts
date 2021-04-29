import app from './src/app'
import configurations from './src/utils/configurations'
import mongoose from 'mongoose'



export const connectToMongooseDatabase = async (): Promise<void> => {
    mongoose.set('useFindAndModify', false)
    mongoose.set('useCreateIndex', true)

    try {
        await mongoose.connect(configurations.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        if (process.env.NODE_ENV !== 'test') {
            console.log('Connected to MongoDB')
        }
    } catch (error) {
        console.log('Error in connecting to MongoDB:', error)
    }
}

const startServer = () => {
    try {
        app.listen({ port: configurations.PORT }, () => {
            console.log('Swaplings server ready at PORT', configurations.PORT)
        })
    } catch (error) {
        console.log('Error in starting the server', error)
    }
}



const connectToDatabaseAndStartServer = async () => {
    await connectToMongooseDatabase()
    startServer()
}



void connectToDatabaseAndStartServer()