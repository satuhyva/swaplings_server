import { Request } from 'express'

export interface RequestWithAuthorization extends Request {
    authorization?: string
}