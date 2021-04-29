export type PersonDatabaseType = {
    id: string,
    username: string,
    passwordHash: string,
    email: string | null,
    ownedItemdIds: string[] | null,
}