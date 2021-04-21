import app from './src/app'
import configurations from './utils/configurations'


app.listen({ port: configurations.PORT }, () => {
    console.log('Swaplings server ready!')
})