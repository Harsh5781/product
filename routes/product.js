const express = require('express')
const router = express.Router()

const mongoose=require('mongoose')
const Product =require('../model/product')
const User = require('../model/user')

const checkLogin = require('../isLoggedin')
const sizes = ['M', 'L', 'XL']
const colors = ['Red', 'While', 'Grey', 'Blue', 'Black', 'Cream', 'Green']
router.get('/new',checkLogin, (req, res)=>{
    res.render('product/new', {colors, sizes})
})

router.route('/')
.get(async(req, res)=>{
    const products = await Product.find()
    
    res.render('product/home', {products})
})
.post(checkLogin,async(req, res)=>{
    try{
        if(req.user.isAdmin){

            const product = new Product(req.body)
            const user = await User.findById(req.user.id)
            product.user = user.id
            user.products.push(product.id)
            await product.save()
            await user.save()
            res.status(200).redirect(`/product/${product.id}`)
        }
    }
    catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

router.get('/myproducts', checkLogin, async (req , res)=>{
    const user = await User.findById(req.user.id).populate('products')
    res.render('product/myproducts', {user})
    
})

router.route('/:id')
.get(async(req,res)=>{
    try {
        const {id}=req.params
        const product = await Product.findById(id).populate('user')
        if(!product){
            return res.status(404).send('No product found')
        }
        res.render('product/show',{product})
    } catch (error) {
        res.status(400).send(error)
    }
})
.put(checkLogin,async(req, res)=>{
    const {id} = req.params
    const product = await Product.findByIdAndUpdate(id, req.body)
    if(!product.user.equals(req.user)){
        return res.redirect(`/product/${id}`)
    }
    res.redirect(`/product/${id}`)
})
.delete(checkLogin,async (req, res)=>{
    try {
        const {id}=req.params
        const product = await Product.findByIdAndDelete(id)
        if(!product){
            return res.status(404).redirect('/product')
        }
        res.redirect('/product')
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/:id/edit',checkLogin,async (req, res)=>{
    const {id} = req.params
    const product = await Product.findById(id).populate('user')
    if(!product.user.equals(req.user)){
        return res.redirect(`/product/${id}`)
    }
    res.render('product/edit', {product, sizes, colors})
})

router.put('/:id/order', checkLogin, async (req, res)=>{
    const {id} = req.params
    const product = await Product.findById(id)
    const user= await User.findById(req.user.id)
    user.order.push(product.id)
    product.orderDetails.push({orderedBy: user.id})
    await product.save()
    await user.save()
    res.redirect(`/product/${id}`)
    
})

module.exports = router