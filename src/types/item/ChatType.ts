export type ChatType = {
    id: string,
    itemIdA: string,
    personIdA: string,
    itemIdB: string,
    personIdB: string,
    posts: {
        post: string,
        postingItemId: string,
        createdAt: number
    }[]
}