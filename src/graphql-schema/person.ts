import { gql } from 'apollo-server-express'
import { PersonDatabaseType } from '../types/person/PersonDatabaseType'



export const personsList = [
    { id: 'a1', username: 'Shallan Davar', email: 'shallan.davar@SpeechGrammarList.com' },
    { id: 'g6', username: 'Kaladin Stormblessed', email: 'kaladin.storblessed@SpeechGrammarList.com' },
    { id: 'h9', username: 'Jasnah Kholin', email: 'jasnah.kholin@SpeechGrammarList.com' },
]

const typeDefs = gql`
    type Person {
        id: ID!
        username: String!
        email: String
    }
    extend type Query {
        persons: [Person]
    }
    extend type Mutation {
        addNewPerson(
            username: String!,
            password: String!,
            email: String
        ): Boolean
    }
`

const resolvers = {
    Query: {
        persons: (): PersonDatabaseType[] => personsList
    },
    Mutation: {
        addNewPerson: (_: void, args: { username: string, email: string }): boolean => {
            const newList = [...personsList, { username: args.username, email: args.email }]
            console.log(newList)
            return true
        }
    }

}

export default {
    typeDefs,
    resolvers
}