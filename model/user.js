const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')
const product = require('./product')


const userSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String, 
        required: true,
        unique:true
    },
    mobileNum:{
        type:Number,
        required:true,
        unique:true
    },
    isAdmin: {
        type: Boolean,
        default:false
    },
    order:[{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    products:[{
        type:Schema.Types.ObjectId,
        ref:'Product'
    }]
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)