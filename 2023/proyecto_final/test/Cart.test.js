import mongoose from "mongoose";
import { cartModel } from "../src/model/Cart.js";
import { userModel } from "../src/model/User.js";
import { productModel } from "../src/model/Product.js";
import { assert, expect } from "chai";
import supertest from "supertest";

await mongoose.connect(process.env.MONGO_URL)
const requester = supertest(`http://localhost:${process.env.PORT}`)

describe('Cart tests', function () {
    
    beforeEach(() => {
        this.timeout(5000)
    })

    it('Has all default keys', async function () {
        const res = await cartModel.findOne()

        expect(Object.keys(res._doc)).to.include.members([
            '_id',
            'price',
            'products'
        ])
    })
    it('Cart IDs are not orphan', async function () {
        const cart_ids = (await cartModel.find({}, {_id: 1 })).map(c_id => c_id._id.toString())
        const user_carts = (await userModel.find({}, { cart: 1 })).map(c_id => c_id.cart.toString())
        expect(cart_ids).to.include.members(user_carts)
    })
    it('All products in carts exist', async function () {
        const prods_in_carts = await cartModel.find({}, {products: 1 })
        prods_in_carts.map(cart => {
            cart.products.map(async (prod) => {
                assert.isNotNull(await productModel.findById(prod.prod_id._id))
            })
        })
    })
    
})