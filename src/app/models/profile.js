const mongoose = require('../../database')
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const {
  promisify
} = require("util");

const s3 = new aws.S3();

const TextSchema = new mongoose.Schema({
  FacebookUrl:String,
  InstagramUrl:String,
  TwitterUrl:String,
  YouTubeUrl:String,
  GithubUrl:String,
  about:{
    type:String,
  },

})

const ProfileSchema = new mongoose.Schema({
  Curriculum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curriculum'
  },
  Evolution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evolution'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  posts: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  createdAd: {
    type: Date,
    default: Date.now
  },
  premiun:Boolean,
  Text:TextSchema,
  avatar:String
})

ProfileSchema.virtual('avatar_url').get(function() {
  return `${process.env.APP_URL}/files/${this.Avatar}`
})

ProfileSchema.pre("remove", function () {
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

const Profile = mongoose.model('Profile', ProfileSchema)

module.exports = Profile
