import mongoose from "mongoose";
import { productModel } from "../src/model/Product.js";
import Assert, { strictEqual } from 'assert';

mongoose.connect(process.env.MONGO_URL)
const assert = Assert.strict

describe('Testing User model', function () {

    it('Returns', async function() {
        this.timeout(10000);
        const res = await productModel.find().then(r=>r)
        console.log(res)
        assert.strictEqual(Array.isArray(res), true)
    })
})