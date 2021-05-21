import { ItemDatabaseType } from './ItemDatabaseType'


export type AddItemResponseType = {
    code: string,
    success: boolean,
    message: string,
    item: ItemDatabaseType | undefined
}