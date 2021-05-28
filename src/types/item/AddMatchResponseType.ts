import { ItemDatabaseType } from './ItemDatabaseType'

export type AddMatchResponseType = {
    code: string,
    success: boolean,
    message: string,
    myItem: ItemDatabaseType | undefined
}