import { Model } from 'mongoose'
import { IPerson } from '../../mongoose-schema/person'
import { RemovePersonType } from '../../types/person/RemovePersonType'
import { REMOVE_PERSON_SUCCESS, REMOVE_PERSON_DATABASE_ERROR, REMOVE_PERSON_UNAUTHORIZED } from './errorMessages'



export const removePersonService = async (authenticatedPerson: IPerson, Person: Model<IPerson>): Promise<RemovePersonType> => {

    if (!authenticatedPerson) {
        return {
            code: '401',
            success: false,
            message: REMOVE_PERSON_UNAUTHORIZED,
            username: undefined,
            facebookName: undefined
        }
    }

    try {
        await Person.findByIdAndRemove(authenticatedPerson._id)
        return {
            code: '200',
            success: true,
            message: REMOVE_PERSON_SUCCESS,
            username: authenticatedPerson.username ?? undefined,
            facebookName: authenticatedPerson.facebookName ?? undefined
        }
    } catch (error) {
        console.log(error)
        return {
            code: '500',
            success: false,
            message: REMOVE_PERSON_DATABASE_ERROR,
            username: authenticatedPerson.username ?? undefined,
            facebookName: authenticatedPerson.facebookName ?? undefined
        }
    }

}