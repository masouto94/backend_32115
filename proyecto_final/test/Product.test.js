import mongoose from "mongoose";
import { productModel } from "../src/model/Product.js";
import { userModel } from "../src/model/User.js";
import { expect } from "chai";
import supertest from "supertest";
import superagent from "superagent"
import { assert } from "chai";

await mongoose.connect(process.env.MONGO_URL)
const requester = supertest(`${process.env.HOST}`)

describe('Product tests', function () {
    before(async() => {
        this.mockUser = {
            first_name: "Mock",
            last_name: "User",
            email: 'mock@user.mail.com',
            age: 18,
            password: 'Passw0rd'
        }
        await requester.post('/sessions/register').send(this.mockUser)
    })
    beforeEach(() => {
        this.timeout(5000)
    })
    it('Codes are unique', async function () {
        const codes = await productModel.find({},{code:1})
        const counts = {}
        for (const num of codes) {
        counts[num] = counts[num] ? counts[num] + 1 : 1;
        }
        Object.values(counts).forEach(element => {
            expect(element).to.eql(1)
        });
    })
    it('Has all default keys', async function () {
        const res = await productModel.findOne()

        expect(Object.keys(res._doc)).to.include.members([
            '_id',
            'title',
            'code',
            'price',
            'stock',
            'description',
            'thumbnail'
        ])
    })
    it('Only admins can modify products', async function () {
        const prev = await productModel.findOne({code:0})
        await requester.put(`/products/${prev._id}`).send({price:2000})
        const post = await productModel.findOne({code:0})
        assert.deepEqual(prev,post)
    })
    after(async () => {
        const user = await userModel.findOne({ user_name: "mock.user" })
        const {statusCode, ok, _body} = await superagent.agent().del(`${process.env.HOST}/users/${user._id}`).set('Authorization', `${process.env.SESSION_SECRET}`)
        assert.strictEqual(statusCode, 200)
        assert.strictEqual(_body.response, 'OK')
        return true
    })
})