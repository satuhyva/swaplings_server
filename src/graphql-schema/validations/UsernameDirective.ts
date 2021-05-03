import { ApolloError, SchemaDirectiveVisitor } from 'apollo-server-express'
import { GraphQLInputField, GraphQLScalarType, GraphQLNonNull } from 'graphql'




class UsernameDirective extends SchemaDirectiveVisitor {
    visitInputFieldDefinition (field: GraphQLInputField): void {
        console.log('args', this.args)
        this.wrapType(field)
    }

    wrapType(field: GraphQLInputField): void {
        console.log('field:\n', field)
        if (field.type instanceof GraphQLNonNull && field.type.ofType instanceof GraphQLScalarType) {
            field.type = new GraphQLNonNull(new LimitedLengthType(field.type.ofType, this.args.max))
        } else if (field.type instanceof GraphQLScalarType) {
            field.type = new LimitedLengthType(field.type, this.args.max)
        } else {
            throw new ApolloError('Not a scalar type!')
        }
    }
}

class LimitedLengthType extends GraphQLScalarType {
    constructor(type: GraphQLScalarType, maxLength:  number) {
        super({
            name: `LengthMax${maxLength}`,
            description: 'Username type for validation',
            serialize(value) {
                console.log('serialize', value)
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return type.serialize(value)
            },
            parseValue(value) {
                console.log('parseValue', value)
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return type.parseValue(value)
            },
            parseLiteral(ast) {
                console.log('parseLiteral', ast)
                console.log('parseLiteral', (ast as unknown as { value: string }).value)
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return type.parseLiteral(ast, {})
            }
        })
    }
}


export default UsernameDirective

