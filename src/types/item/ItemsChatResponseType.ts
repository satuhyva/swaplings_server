export type ItemsChatResponseType = {
        id: string | undefined,
        itemIdA: string,
        itemIdB: string,
        posts: {
                post: string,
                postingItemId: string,
                createdAt: number                
        }[]
}