import { 
    ApolloError, 
    SchemaDirectiveVisitor } from 'apollo-server-express'
import { GraphQLInputField, 
    GraphQLScalarType, 
    GraphQLNonNull 
} from 'graphql'
// import { INVALID_USERNAME, INVALID_PASSWORD, INVALID_EMAIL } from './errorMessages'




class SignUpLoginPersonInputDirective extends SchemaDirectiveVisitor {

    visitInputFieldDefinition (field: GraphQLInputField): void {
        const target = field.name
        console.log('target', target)
        if (target !== 'username' && target !== 'password' && target !== 'email') throw new ApolloError(`${target} is not an input field and cannot be validated`)
        if (field.type instanceof GraphQLNonNull && field.type.ofType instanceof GraphQLScalarType) {
            console.log('1')
            // field.type = new GraphQLNonNull(new ValidatedPersonInputFieldType(field.type.ofType, target))
        } else if (field.type instanceof GraphQLScalarType) {
            console.log('2')
            field.type = new ValidatedPersonInputFieldType(field.type, target)
        } else {
            throw new ApolloError('Not a scalar type!')
        }
    }
}


// const checkPersonInputValidity = (target: 'username' | 'password' | 'email', value: unknown): void => {
//     console.log('t', target, value)
//     if (target === 'username') {
//         if (!value || !(typeof value === 'string' ) || value.length < 3 || value.length > 25) {
//             throw new ApolloError(INVALID_USERNAME)
//         }
//     } else if (target === 'password') {
//         if (!value || !(typeof value === 'string') || value.length < 8 || value.length > 25) {
//             throw new ApolloError(INVALID_PASSWORD)
//         }
//     } else if (target === 'email') {
//         if (!value) return undefined
//         else {
//             const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+[.]([a-zA-Z]{2,5})$/
//             if (typeof value !== 'string' || !(regex.test(value))) {
//                 throw new ApolloError(INVALID_EMAIL)
//             }
//         }
//     } 
// }


class ValidatedPersonInputFieldType extends GraphQLScalarType {
    constructor(type: GraphQLScalarType, target: 'username' | 'password' | 'email') {
        super({
            name: `${target}InputType`,
            description: `Validated ${target} input`,
            serialize(value) {
                return type.serialize(value) as string
            },
            parseValue(value) {
                return type.parseValue(value) as string
            },
            parseLiteral(ast) {
                // checkPersonInputValidity(target, (ast as unknown as { value: unknown }).value)
                return type.parseLiteral(ast, {}) as string
            }
        })
    }
}



export default SignUpLoginPersonInputDirective

