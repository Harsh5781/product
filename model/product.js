const mongoose = require('mongoose')
const {Schema} = mongoose

const productSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    color:{
        type:String,
        required:true,
        enum: ['Red', 'While', 'Grey', 'Blue', 'Black', 'Cream', 'Green']
    },
    price:{
        type:Number,
        required:true
    }, 
    size:{
        type:String,
        required:true,
        enum:['M', 'L', 'XL']
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    orderDetails:[{
        orderedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        
    },
    time : { type : Date, default: Date.now }
}]
})

module.exports= mongoose.model('Product', productSchema)