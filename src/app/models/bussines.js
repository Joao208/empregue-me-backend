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
    avatar:String,
    bio:String,
    site:String
})
BussinesSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password,10)
    this.password = hash
    
    next()
})
BussinesSchema.virtual('avatar_url').get(function() {
    return `${process.env.APP_URL}/files/${this.Avatar}`
  })
  
BussinesSchema.pre("remove", function () {
    if ('local' === "s3") {
      return s3
        .deleteObject({
          Bucket: 'serverem',
          avatar: this.avatar
        })
        .promise()
        .then(response => {
          console.log(response.status);
        })
        .catch(response => {
          console.log(response.status);
        });
    } else {
      return promisify(fs.unlink)(
        path.resolve(__dirname, "..", "..", "tmp", "uploads", this.avatar)
      );
    }
  });
  


const Bussines = mongoose.model('Bussines', BussinesSchema)

module.exports = Bussines