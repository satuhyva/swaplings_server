import { gql } from 'apollo-server-express'

const personsList = [
    { username: 'Shallan Davar', email: 'shallan.davar@SpeechGrammarList.com' },
    { username: 'Kaladin Stormblessed', email: 'kaladin.storblessed@SpeechGrammarList.com' },
    { username: 'Jasnah Kholin', email: 'jasnah.kholin@SpeechGrammarList.com' },
]

const typeDefs = gql`
    type Person {
        username: String
        email: String
    }
    extend type Query {
        persons: [Person]
    }
`

const resolvers = {
    Query: {
        persons: () => personsList
    },
    // Mutation: {

    // }

}

export default {
    typeDefs,
    resolvers
}