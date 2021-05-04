import Discussion from '../mongoose-schema/discussion'
import Item from '../mongoose-schema/item'
import Person from '../mongoose-schema/person'


export const clearTestDatabase = async (): Promise<void> => {
    const collections = [Person, Item, Discussion]
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const deletions = collections.map(async (collection) =>  await collection.remove())
    await Promise.all(deletions)
}