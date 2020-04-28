const mongoose = require('../../database')
const bcrypt = require('bcryptjs')
const PointSchema = require('./utils/PointSchema');


const InputSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },

})

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
    passwordResetToken:{
        type:String,
        select:false
    },
    passwordResetExpires:{
        type:Date,
        select:false
    },
    createdAd:{
        type:Date,
        default:Date.now
    },
    inputs:InputSchema,
    location: {
      type: PointSchema,
      index: '2dsphere'
    },
    url: String,

  
})

UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password,10)
    this.password = hash
    
    next()
})

  
const User = mongoose.model('User', UserSchema)

module.exports = User