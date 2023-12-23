import mongoose from "mongoose";
import { cartModel } from "../src/model/Cart.js";
import Assert, { strictEqual } from 'assert';
import { expect } from "chai";

await mongoose.connect(process.env.MONGO_URL)

describe('Cart tests', function () {
    beforeEach(function(){
        this.timeout(5000)
    })
    describe('Cart schema validations', ()=>
        it('Has all default keys', async function() {
            const res = await cartModel.findOne()
            
            expect(Object.keys(res._doc)).to.include.members([
                '_id',
                'price',
                'products'
            ])
        }
     ))
})