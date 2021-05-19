export type PersonDatabaseType = {
    id: string,
    username: string | null,
    passwordHash: string | null,
    email: string | null,
    facebookId: string | null,
    facebookName: string | null,
    ownedItemdIds: string[] | null,
}