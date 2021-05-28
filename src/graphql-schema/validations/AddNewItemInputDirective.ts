import { ApolloError, SchemaDirectiveVisitor } from 'apollo-server-express'
import { GraphQLInputField, GraphQLScalarType, GraphQLNonNull } from 'graphql'
import { isPriceGroup } from './isPriceGroup'
import { INVALID_USERNAME, INVALID_TITLE, INVALID_PRICEGROUP, INVALID_DESCRIPTION } from '../custom-scalars/errorMessages'




class AddNewItemToPersonInputDirective extends SchemaDirectiveVisitor {

    visitInputFieldDefinition (field: GraphQLInputField): void {
        const target = field.name
        if (target !== 'username' && target !== 'title' && target !== 'priceGroup'  && target !== 'description') throw new ApolloError(`${target} is not an input field and cannot be validated`)
        if (field.type instanceof GraphQLNonNull && field.type.ofType instanceof GraphQLScalarType) {
            field.type = new GraphQLNonNull(new ValidatedItemInputFieldType(field.type.ofType, target))
        } else if (field.type instanceof GraphQLScalarType) {
            field.type = new ValidatedItemInputFieldType(field.type, target)
        } else {
            throw new ApolloError('Not a scalar type!')
        }
    }
}


const checkItemInputValidity = (target: 'username' | 'title' | 'priceGroup' | 'description', value: unknown): void => {
    if (target === 'username') {
        if (!value || !(typeof value === 'string' ) || value.length < 3 || value.length > 25) {
            throw new ApolloError(INVALID_USERNAME)
        }
    } else if (target === 'title') {
        if (!value || !(typeof value === 'string') || value.length < 3 || value.length > 100) {
            throw new ApolloError(INVALID_TITLE)
        }
    } else if (target === 'priceGroup') {
        if (!value || typeof value !== 'string' || !isPriceGroup(value)) {
            throw new ApolloError(INVALID_PRICEGROUP)
        }
    } else if (target === 'description') {
        if (!value || !(typeof value === 'string') || value.length < 3 || value.length > 500) {
            throw new ApolloError(INVALID_DESCRIPTION)
        }
    } 
}


class ValidatedItemInputFieldType extends GraphQLScalarType {
    constructor(type: GraphQLScalarType, target: 'username' | 'title' | 'priceGroup' | 'description') {
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
                checkItemInputValidity(target, (ast as unknown as { value: unknown }).value)
                return type.parseLiteral(ast, {}) as string
            }
        })
    }
}



export default AddNewItemToPersonInputDirective

