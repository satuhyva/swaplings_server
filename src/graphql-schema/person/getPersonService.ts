// import { Model } from 'mongoose'
// import { IPerson } from '../../mongoose-schema/person'
// import { PersonDatabaseType } from '../../types/person/PersonDatabaseType'
// import { ApolloError } from 'apollo-server-express'
// import { getPersonDatabaseType } from './getPersonDatabaseType'



// export const getPersonService = async (personId: string, Person: Model<IPerson>): Promise<PersonDatabaseType> => {
//     const person = await Person.findById(personId)
//     if (!person) throw new ApolloError('Item must have an owner.')
//     return getPersonDatabaseType(person)
// }