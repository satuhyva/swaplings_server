import { Model } from 'mongoose'
import { IPerson } from '../../mongoose-schema/person'
import { AddPersonInputType } from '../../types/person/AddPersonInputType'
import bcryptjs from 'bcryptjs'
import { ApolloError } from 'apollo-server-express'
import { PersonDatabaseType } from '../../types/person/PersonDatabaseType'


export const addNewPersonService = async (
    Person: Model<IPerson>, 
    personInput: AddPersonInputType
    ): Promise<Omit<PersonDatabaseType, 'passwordHash'>> => {

    const { username, password, email } = personInput

    if (email) {
        const existingPersonWithEmail = await Person.find({ email: email })
        if (existingPersonWithEmail.length > 0) {
            throw new ApolloError('Email already in use. Duplicate emails are not allowed. Cannot create another person with this email.')
        }
    }

    const salt = bcryptjs.genSaltSync(10)
    const passwordHash = bcryptjs.hashSync(password, salt)

    let savedNewPerson: IPerson 
    try {
        const personToAdd = new Person({ username: username, passwordHash: passwordHash, email: email })
        savedNewPerson = await personToAdd.save()
    } catch (error) {
        throw new ApolloError('Error in adding new person:', error)
    }
        
    return { 
        id: savedNewPerson._id, 
        username: savedNewPerson.username, 
        email: savedNewPerson.email, 
        ownedItemdIds: savedNewPerson.ownedItemIds 
    }
}