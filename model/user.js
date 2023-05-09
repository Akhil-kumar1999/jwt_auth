const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isEmail');
const {validate} = ('validator')
const bcrypt = require('bcrypt')

mongoose.connect('mongodb://127.0.0.1:27017/jwtDB');

const userSchema = new mongoose.Schema({

email:{
    type:String,
    required:[true,'please enter the password'],
    unique:[true,'the email is already exist'],
    lowercase:[true,'email id is must be lower case'],
    validate:[isEmail, 'please enter a valid email']
},

password:{
    type:String,
    required:[true,'please enter the password'],
    minLength:[5, 'minimum password length is  5 chatacter ']
}
})

userSchema.pre('save',async function(next){
    const salt =await  bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

// static method to user login
    userSchema.statics.login = async (email,password)=>{
    const user  =await User.findOne({email})
    if(user){
    const auth =await bcrypt.compare(password,user.password)
        if(auth){
            return user
        }
        throw Error('incorrect password')
    } 
    throw Error('incorrect email')
}

const User  = mongoose.model('User',userSchema)

module.exports = User