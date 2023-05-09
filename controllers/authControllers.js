
const { json } = require('express');
const User = require('../model/user')
const jwt = require('jsonwebtoken')


const handleError = (err)=>{
console.log(err.message,err.code);
let errors = {email:'',password:''}

   // email error
   if(err.message === 'incorrect email'){
    errors.email = 'the email is not registerd'
    return errors;
     }
   // password error
   if(err.message === 'incorrect password'){
       errors.password = 'password is not correct'
       return errors
     }

// validation Error
if(err.message.includes("User validation failed")){
 Object.values(err.errors).forEach(({properties})=>{
    errors[properties.path] = properties.message
 }) 
 return errors
}

// duplicate email
if(err.code === 11000){
    errors.email = 'the email is already exist'
    return errors
}

}
const maxAge = 3 * 24 * 60 *60
const createWebtoken = (id)=>{
  return jwt.sign({id},'this is secret',{expiresIn:maxAge})
}

module.exports.signup_get = (req,res)=>{
    res.render('signup')
}


module.exports.signup_post = async (req,res)=>{
    const{email,password} = req.body
          
    try{
        const user =await User.create({email:email,password:password})
        const token  = createWebtoken(user._id)
        res.cookie('jwt', token, { maxAge:maxAge*1000, httpOnly:true } )
        console.log(user);
        res.status(201).json({user:user._id})
    }
    catch(err){
    const error = handleError(err)
    res.status(400).json({error})
    }
     
}


module.exports.login_get = (req,res)=>{
    res.render('login')
}

module.exports.login_post =async (req,res)=>{
    const {email,password}= req.body
    try{
       const user =await User.login(email,password)
       const token  = createWebtoken(user._id)
       res.cookie('jwt', token, { maxAge:maxAge*1000, httpOnly:true } )
       res.status(200).json({user:user._id})
    }
    catch(err){
        const error = handleError(err)
        res.status(400).json({error})
    }
}

module.exports.logout_get = (req,res)=>{
    res.cookie('jwt','')
    res.redirect('/')
}