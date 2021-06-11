import { ItemDatabaseType } from './ItemDatabaseType'

export type ChangeMatchResponseType = {
    code: string,
    success: boolean,
    message: string,
    myItem: ItemDatabaseType | undefined
}