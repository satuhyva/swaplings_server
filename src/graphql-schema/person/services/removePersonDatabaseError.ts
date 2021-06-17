import {  ClientSession } from 'mongoose'
import { IPerson } from '../../../mongoose-schema/person'
import { RemovePersonType } from '../../../types/person/RemovePersonType'
import { REMOVE_PERSON_DATABASE_ERROR } from '../helpers/errorMessages'



export const databaseError = async (session: ClientSession, errorMessage: string, authenticatedPerson: IPerson): Promise<RemovePersonType> => {
    await session.abortTransaction()
    session.endSession()
    console.log(errorMessage)
    return {
        code: '500',
        success: false,
        message: REMOVE_PERSON_DATABASE_ERROR,
        id: authenticatedPerson._id,
        username: authenticatedPerson.username ?? undefined,
        facebookName: authenticatedPerson.facebookName ?? undefined
    }
}