const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'product name must be provided']
    },
    price:{
        type:Number,
        required: [true, 'product price must be provided']
    },
    featured:{
        type:Boolean,
        default:false
    },
    rating:{
        type:Number,
        default:4.5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    company:{
        type:String,
        //enum:['ikea','liddy','caressa','marcos'] //to add limitations
        enum:{
            values:['ikea','liddy','caressa','marcos'],
            message:'{VALUE} is not supported' //err msg when we deviate from this array
        }
    }

})

module.exports = mongoose.model('Product',productSchema)