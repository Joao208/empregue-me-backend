const mongoose = require('../../database')
const bcrypt = require('bcryptjs')
const PointSchema = require('./utils/PointSchema');
const aws = require("aws-sdk");
const s3 = new aws.S3();

const UserSchema = new mongoose.Schema({
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
    followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    followersbussines: [{ type: mongoose.Schema.ObjectId, ref: 'Bussines' }],
    followingbussines: [{ type: mongoose.Schema.ObjectId, ref: 'Bussines' }],
    name:String,
    FacebookUrl:String,
    InstagramUrl:String,
    TwitterUrl:String,
    YouTubeUrl:String,
    GithubUrl:String,
    bio:String,
    phone:Number,
    phonetoken:String,
    phonetokenexpiress:Date,
    profession:[String],
    usertoken:String,
    usertokenexpiress:Date,
    stripeCustomerId:String,
    avatar:{
      type:String,
      default:'https://api.adorable.io/avatars/285/abott@adorable'
    },
    phoneConfirme:Boolean,
    confirmate:{
      type:Boolean,
      default:false
    },
    location: {
        type: PointSchema,
        index: '2dsphere'
      },
})


UserSchema.pre('save', async function hashPassword (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 8)
})

UserSchema.virtual('avatar_url').get(function() {
    return `${process.env.APP_URL}/files/${this.Avatar}`
  })

  UserSchema.pre("remove", function () {
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


const User = mongoose.model('User', UserSchema)

module.exports = User
