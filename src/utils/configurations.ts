import * as dotenv from 'dotenv'
dotenv.config()


const PORT = process.env.PORT
const NODE_ENV = process.env.NODE_ENV
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
const JWT_SECRET = process.env.JWT_SECRET || ''

let MONGO_DB_URL = process.env.MONGO_DB_URL
if (process.env.NODE_ENV === 'test') {
    MONGO_DB_URL = process.env.MONGO_DB_TEST_URL
}
if (!MONGO_DB_URL) throw new Error('MONGO_DB_URL is missing a value!')


export default {
    PORT,
    NODE_ENV,
    MONGO_DB_URL,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    JWT_SECRET
}