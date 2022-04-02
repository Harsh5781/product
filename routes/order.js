const express = require('express')
const router = express.Router()

const mongoose=require('mongoose')
const Product =require('../model/product')
const User = require('../model/user')

const checkLogin = require('../isLoggedin')

router.route('/')
.get(checkLogin, async (req, res)=>{
    const user = await User.findById(req.user.id).populate('order')
    
    res.render('order/home', {user})
})

router.get('/received', checkLogin, async (req, res)=>{
    const user = await User.findById(req.user.id).populate('products')
    let products = []
    for(let i=0; i<user.products.length; i++)
    {
        products.push(await Product.findById(user.products.at(i).id).populate('orderDetails.orderedBy'))
    }
    // res.send({products})
    res.render('order/received', {products})
})

module.exports= router