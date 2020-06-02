const mongoose = require("mongoose");
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const {
  promisify
} = require("util");

const s3 = new aws.S3();

const TextSchema = new mongoose.Schema({
  Text:String
})
const PostSchema = new mongoose.Schema({
  Text: TextSchema,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  likeCount:{
    type:Number,
    default:0
  },
  avatar:String,
  comments: [{ type: mongoose.Schema.ObjectId, ref: "Coment" }],
  commentCount:{
    type:Number,
    default:0
  },
  type:String,
  isVideo:Boolean

})

PostSchema.virtual('avatar_url').get(function() {
  return `${process.env.APP_URL}/files/${this.Avatar}`
})

PostSchema.pre("remove", function () {
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

module.exports = mongoose.model("Post", PostSchema);
