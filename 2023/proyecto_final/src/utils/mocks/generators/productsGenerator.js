import { faker } from "@faker-js/faker";

const generateProducts = (amount=10) => {
    const mocks = []
    for (let i = 0; i < amount; i++) {
        mocks.push( {
            _id: faker.database.mongodbObjectId(),
            title: faker.commerce.product(),
            code: i,
            price: faker.number.float({min:0.1, max: 99999.99, precision:0.01}),
            stock: faker.number.int({min:0, max:10000}),
            description: faker.commerce.productDescription(),
            thumbnail: faker.image.url()
        })
        
    }
    return mocks
}

export{
    generateProducts
}