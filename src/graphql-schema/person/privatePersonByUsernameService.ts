// import { ApolloError } from 'apollo-server-express'
// import { Model } from 'mongoose'
// import { IPerson } from '../../mongoose-schema/person'
// import { PersonDatabaseType } from '../../types/person/PersonDatabaseType'


// export const privatePersonByUsernameService = async (
//     Person: Model<IPerson>,
//     username: string
//     ):Promise<Omit<PersonDatabaseType, 'passwordHash'> | null> => {

//         let person: IPerson | null
//         try {
//             person = await Person.findOne({ username: username })
//         } catch (error) {
//             throw new ApolloError('Error in getting private person by username: ', error)
//         }

//         if (person === null) return null
//         return { 
//             id: person._id, 
//             username: person.username, 
//             email: person.email, 
//             ownedItemdIds: person.ownedItemIds 
//         }

// }