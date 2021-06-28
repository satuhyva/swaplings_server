import bcryptjs from 'bcryptjs'
import { PriceGroupEnum } from '../types/price-group/PriceGroupEnum'


export const USERNAME = 'Shallan Davar'
export const PASSWORD = 'secretsecret'
export const EMAIL = 'shallan.davar@gmail.com'
const salt = bcryptjs.genSaltSync(10)
export const PASSWORDHASH = bcryptjs.hashSync(PASSWORD, salt)

export const FACEBOOK_ID = 'some Facebook id'
export const FACEBOOK_NAME = 'some Facebook name'
export const FACEBOOK_ACCESS_TOKEN = 'some Facebook access token'

export const TITLE = 'Some item title'
export const PRICE_GROUP = PriceGroupEnum.GROUP_2
export const DESCRIPTION = 'Some item description'
export const BRAND = 'Some item brand'
export const IMAGE_PUBLIC_ID = 'Some image public ID'
export const IMAGE_SECURE_URL = 'Some image url'

export const POST = 'Some Post!'


