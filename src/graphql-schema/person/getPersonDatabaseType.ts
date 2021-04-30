import { IPerson } from '../../mongoose-schema/person'
import { PersonDatabaseType } from '../../types/person/PersonDatabaseType'



export const getPersonDatabaseType = (personToConvert: IPerson): PersonDatabaseType => {
    return {
        id: personToConvert._id, 
        username: personToConvert.username, 
        passwordHash: personToConvert.passwordHash, 
        email: personToConvert.email ,
        ownedItemdIds: personToConvert.ownedItemIds,
    }
}