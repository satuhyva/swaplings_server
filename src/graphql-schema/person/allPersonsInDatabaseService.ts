import { ApolloError } from 'apollo-server-express'
import { Model } from 'mongoose'
import { IPerson } from '../../mongoose-schema/person'
import { PersonDatabaseType } from '../../types/person/PersonDatabaseType'
import { getPersonDatabaseType } from './getPersonDatabaseType'



export const allPersonsInDatabaseService = async (Person: Model<IPerson>): Promise<PersonDatabaseType[]> => {

    if (process.env.NODE_ENV === 'production') {
        throw new ApolloError('The "get all persons in database"-functionality is not available in production mode.')
    }
    
    let allPersons: IPerson[]
    try {
        allPersons = await Person.find({})
    } catch (error) {
        throw new ApolloError('Error getting all persons in database: ', error)
    }
    
    return allPersons.map(personInDatabase => getPersonDatabaseType(personInDatabase))
    
}