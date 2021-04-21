import * as dotenv from 'dotenv'
dotenv.config()


const PORT = process.env.PORT
const NODE_ENV = process.env.NODE_ENV

let MONGO_DB_URL = process.env.MONGO_DB_URL
if (process.env.NODE_ENV === 'test') {
    MONGO_DB_URL = process.env.MONGO_DB_TEST_URL
}
if (!MONGO_DB_URL) throw new Error('MONGO_DB_URL is missing a value!')


export default {
    PORT,
    NODE_ENV,
    MONGO_DB_URL
}