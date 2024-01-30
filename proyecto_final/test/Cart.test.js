import mongoose from "mongoose";
import { cartModel } from "../src/model/Cart.js";
import { userModel } from "../src/model/User.js";
import { productModel } from "../src/model/Product.js";
import { assert, expect } from "chai";
import supertest from "supertest";

await mongoose.connect(process.env.MONGO_URL)
const requester = supertest(`${process.env.HOST}`)

describe('Cart tests', function () {
    before(() => {
        const mockUser = {
            first_name: "Mock",
            last_name: "User",
            email: 'mock@user.mail.com',
            age: 18,
            password: 'Passw0rd'
        }
        requester.post("sessions/register/").send(mockUser).then(r=>r)
    })
    beforeEach(() => {
        this.timeout(5000)
    })

    it('Has all default keys', async () => {

        const cart = await userModel.find({user_name:"mock.user"}).then(r => cartModel.findOne(r.cart))
        expect(Object.keys(cart._doc)).to.include.members([
            '_id',
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