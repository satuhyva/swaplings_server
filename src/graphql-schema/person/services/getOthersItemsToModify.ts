



export const getOthersItemsToModify = (ownedItemIds: { _id: string, matchedToIds: string[], matchedFromIds: string[] }[]): Record<string, { from: string[], to: string[] }> => {
    const othersItemsToModify: Record<string, { from: string[], to: string[] }> = {}
    ownedItemIds.forEach(personsItem => {
        personsItem.matchedToIds.forEach(othersFromId => {
            if (!othersItemsToModify[othersFromId.toString()]) {
                othersItemsToModify[othersFromId.toString()] = { from: [personsItem._id.toString()], to: [] }
            } else {
                othersItemsToModify[othersFromId.toString()] = { 
                    ...othersItemsToModify[othersFromId.toString()], 
                    from: [...othersItemsToModify[othersFromId.toString()].from, personsItem._id.toString()]
                }
            }
        })
        personsItem.matchedFromIds.forEach(othersToId => {
            if (!othersItemsToModify[othersToId.toString()]) {
                othersItemsToModify[othersToId.toString()] = { from: [], to: [personsItem._id.toString()]}
            } else {
                othersItemsToModify[othersToId.toString()] = { 
                    ...othersItemsToModify[othersToId.toString()], 
                    to: [...othersItemsToModify[othersToId.toString()].to, personsItem._id.toString()]
                }
            }
        })
    })
    return othersItemsToModify
}