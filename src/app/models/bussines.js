const mongoose = require('../../database')
const bcrypt = require('bcryptjs')
const PointSchema = require('./utils/PointSchema');

const CnpjIShcema = new mongoose.Schema({
    atividade_principal:Array,
    complemento:String,
    telefone:String,
    situacao:String,
    logradouro:String,
    numero:String,
    cep:String,
    nome:String

})

const BussinesSchema = new mongoose.Schema({
    cnpj:{
        type:Number,
    },
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
    createdAd:{
        type:Date,
        default:Date.now
    },
    passwordResetToken:{
        type:String,
        select:false
    },
    passwordResetExpires:{
        type:Date,
        select:false
    },
    cnpjI:CnpjIShcema,
    location: {
      type: PointSchema,
      index: '2dsphere'
    },
})
BussinesSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password,10)
    this.password = hash
    
    next()
})

const Bussines = mongoose.model('Bussines', BussinesSchema)

module.exports = Bussines