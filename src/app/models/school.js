const mongoose = require('../../database')
const bcrypt = require('bcryptjs')

const SchoolSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        require:true,
        lowercase:true,
    },
    password:{
        type:String,
        require:true,
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
    createdAt:{
        type:Date,
        default:Date.now
    },
    name:String,
    bio:String,
    avatar:{
      type:String,
      default:'https://api.adorable.io/avatars/285/abott@adorable'
    },
    confirmate:Boolean,
    usertoken: String,
    usertokenexpiress: Date,
    compras:{
      type:Number,
      default:0
    },
    vendas_em_valores:{
      type:Number,
      default:0
    },
  })


SchoolSchema.pre('save', async function hashPassword (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 8)
})

SchoolSchema.virtual('avatar_url').get(function() {
    return `${process.env.APP_URL}/files/${this.Avatar}`
  })

  SchoolSchema.pre("remove", function () {
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


const School = mongoose.model('School', SchoolSchema)

module.exports = School
