const mongoose = require('../../database')
const bcrypt = require('bcryptjs')
const PointSchema = require('./utils/PointSchema');

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
    createdAd:{
        type:Date,
        default:Date.now
    },
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
    avatar:String,
    location: {
        type: PointSchema,
        index: '2dsphere'
      },
})

UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password,10)
    this.password = hash
    
    next()
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