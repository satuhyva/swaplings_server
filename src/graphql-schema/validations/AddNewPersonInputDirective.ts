import { ApolloError, SchemaDirectiveVisitor } from 'apollo-server-express'
import { GraphQLInputField, GraphQLScalarType, GraphQLNonNull } from 'graphql'





class AddNewPersonInputDirective extends SchemaDirectiveVisitor {

    visitInputFieldDefinition (field: GraphQLInputField): void {
        const target = field.name
        if (target !== 'username' && target !== 'password' && target !== 'email') throw new ApolloError(`${target} is not an input field and cannot be validated`)
        if (field.type instanceof GraphQLNonNull && field.type.ofType instanceof GraphQLScalarType) {
            field.type = new GraphQLNonNull(new ValidatedPersonInputFieldType(field.type.ofType, target))
        } else if (field.type instanceof GraphQLScalarType) {
            field.type = new ValidatedPersonInputFieldType(field.type, target)
        } else {
            throw new ApolloError('Not a scalar type!')
        }
    }
}


const checkPersonInputValidity = (target: 'username' | 'password' | 'email', value: unknown): void => {
    if (target === 'username') {
        if (!value || !(typeof value === 'string' ) || value.length < 3 || value.length > 25) {
            throw new ApolloError('Error in person input in field: username. Username must be a string with 3-25 characters.')
        }
    } else if (target === 'password') {
        if (!value || !(typeof value === 'string') || value.length < 8 || value.length > 25) {
            throw new ApolloError('Error in person input in field: password. Password must be a string with 8-25 characters.')
        }
    } else if (target === 'email') {
        if (!value) return undefined
        else {
            const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+[.]([a-zA-Z]{2,5})$/
            if (typeof value !== 'string' || !(regex.test(value))) {
                throw new ApolloError('Error in person input in field: email. Email must be a proper email.')
            }
        }
    } else {
        throw new Error('dsfdsfds')
    }
}


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
                checkPersonInputValidity(target, (ast as unknown as { value: unknown }).value)
                return type.parseLiteral(ast, {}) as string
            }
        })
    }
}



export default AddNewPersonInputDirective

