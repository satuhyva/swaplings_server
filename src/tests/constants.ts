import bcryptjs from 'bcryptjs'


export const USERNAME = 'Shallan Davar'
export const PASSWORD = 'secretsecret'
export const EMAIL = 'shallan.davar@gmail.com'
const salt = bcryptjs.genSaltSync(10)
export const PASSWORDHASH = bcryptjs.hashSync(PASSWORD, salt)

export const FACEBOOK_ID = 'some Facebook id'
export const FACEBOOK_NAME = 'some Facebook name'
export const FACEBOOK_ACCESS_TOKEN = 'some Facebook access token'


