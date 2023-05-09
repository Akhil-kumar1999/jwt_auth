
const jwt = require('jsonwebtoken')
const User =require ('../model/user')

const requireAuth = (req,res,next)=>{
    const token = req.cookies.jwt
    
    if(token){
        jwt.verify(token,'this is secret', (err,decodedToken)=>{
            if(err){
                res.redirect('/login')
            }else{
                next()
            }
        })
    }
    else{
     res.redirect('/login')
    }
}

const checkUser = (req,res,next)=>{
    const token = req.cookies.jwt

    if(token){
     jwt.verify(token,'this is secret', async (err,decodedToken)=>{
        if(err){
            console.log(err.message);
            res.locals.user = null
            next()
        }
        else{
            const user = await User.findById(decodedToken.id)
            // inject the user into our views
            res.locals.user = user
            next()
        }
     })
    }
    else{
        res.locals.user = null
        next()
    }
}

module.exports = {requireAuth,checkUser}