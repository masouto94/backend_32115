import mongoose from "mongoose";
import { assert, expect } from "chai";
import { userModel } from "../src/model/User.js";
import supertest from "supertest";

await mongoose.connect(process.env.MONGO_URL)

const requester = supertest(`http://localhost:${process.env.PORT}`)
describe('Session tests', function () {
    before(() => {
        this.mockUser = {
            first_name: "Mock",
            last_name: "User",
            email: 'mock@user.mail.com',
            age: 18,
            password: 'Passw0rd'
        }
    })
    beforeEach(() => {
        this.timeout(5000)
    })

    it('Should register new user and redirect', async () => {
        const { statusCode, ok, _body } = await requester.post('/sessions/register').send(this.mockUser)
        assert.strictEqual(statusCode, 302)
        return true
    }
    )
    it('Should have default user_name', async () => {
        const mock_db = await userModel.findOne({user_name: "mock.user"})
        assert.strictEqual(mock_db.user_name,"mock.user")
        return true
    })
    it('Should delete mock user from db successfully', async () => {
        const user = await userModel.findOne({ user_name: "mock.user" })
        const { statusCode, ok, _body } = await requester.del(`/users/${user._id}`)
        assert.strictEqual(statusCode, 200)
        assert.strictEqual(_body.response, 'OK')
        return true
    })
})