"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cloudinary_1 = __importDefault(require("cloudinary"));
const configurations_1 = __importDefault(require("../../utils/configurations"));
const multer_1 = __importDefault(require("multer"));
const parser_1 = __importDefault(require("datauri/parser"));
const cloudinaryV2 = cloudinary_1.default.v2;
cloudinaryV2.config({
    cloud_name: configurations_1.default.CLOUDINARY_CLOUD_NAME,
    api_key: configurations_1.default.CLOUDINARY_API_KEY,
    api_secret: configurations_1.default.CLOUDINARY_API_SECRET
});
const storage = multer_1.default.memoryStorage();
const multerUploads = multer_1.default({ storage }).single('image');
const imageRouter = express_1.Router();
// eslint-disable-next-line @typescript-eslint/no-misused-promises
imageRouter.post('/', multerUploads, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('UPLOADING IMAGE');
    if (!request.file)
        throw new Error('Image file is missing!');
    const buffer = request.file.buffer;
    const dataUriParser = new parser_1.default();
    const fileDataUriContent = dataUriParser.format('.png', buffer).content;
    if (!fileDataUriContent)
        throw new Error('Image file content is missing!');
    try {
        const cloudinaryResponse = yield cloudinaryV2.uploader.upload(fileDataUriContent, { folder: 'items/' });
        response.send({
            public_id: cloudinaryResponse.public_id,
            secure_url: cloudinaryResponse.secure_url
        });
    }
    catch (error) {
        console.log('Error uploading image to Cloudinary:\n', error);
    }
}));
exports.default = imageRouter;
