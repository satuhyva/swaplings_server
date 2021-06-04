import { ItemPublicType } from './ItemPublicType'
import { BrowseItemsInputType } from './BrowseItemsInputType'



type EdgeType = {
    cursor: string,
    node: ItemPublicType
}


type PageInfoType = {
    endCursor: string | undefined,
    hasNextPage: boolean | undefined
}

export type BrowseItemsByPageInputType = {
    first: number,
    after: string
    browseItemsInput: BrowseItemsInputType
}

export type BrowseItemsByPageResponseType = {
    edges: EdgeType[],
    pageInfo: PageInfoType
}