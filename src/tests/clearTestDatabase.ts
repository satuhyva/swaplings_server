import Chat from '../mongoose-schema/chat'
import Item from '../mongoose-schema/item'
import Person from '../mongoose-schema/person'



export const clearTestDatabase = async (): Promise<void> => {

    await Person.deleteMany({})
    await Item.deleteMany({})
    await Chat.deleteMany({})

}
