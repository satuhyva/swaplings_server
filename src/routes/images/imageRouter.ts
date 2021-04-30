import { Router } from 'express'
import cloudinary from 'cloudinary'
import configurations from '../../utils/configurations'
import multer from 'multer'
import DatauriParser from 'datauri/parser'

const cloudinaryV2 = cloudinary.v2
cloudinaryV2.config({
    cloud_name: configurations.CLOUDINARY_CLOUD_NAME,
    api_key: configurations.CLOUDINARY_API_KEY,
    api_secret: configurations.CLOUDINARY_API_SECRET
})


const storage = multer.memoryStorage()
const multerUploads = multer({ storage }).single('image')




const imageRouter = Router()


// eslint-disable-next-line @typescript-eslint/no-misused-promises
imageRouter.post('/', multerUploads,  async (request, response) => {
    if (!request.file) throw new Error('Image file is missing!')
    const buffer = request.file.buffer
    const dataUriParser = new DatauriParser()
    const fileDataUriContent =  dataUriParser.format('.png', buffer).content
    if (!fileDataUriContent) throw new Error('Image file content is missing!') 

    try {
        const cloudinaryResponse = await cloudinaryV2.uploader.upload(fileDataUriContent, { folder: 'items/' })
        response.send({
            public_id: cloudinaryResponse.public_id,
            secure_url: cloudinaryResponse.secure_url
        })
    } catch (error) {
        console.log('Error uploading image to Cloudinary:\n', error)
    }
})

export default imageRouter

