const mongoose = require('mongoose')
const aws = require("aws-sdk");
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
  if(this.avatar)
    return s3
      .deleteObject({
        Bucket: 'serverem',
        Key: this.avatar
      })
      .promise()
      .then(response => {
        console.log(response.status);
      })
      .catch(response => {
        console.log(response.status);
      });
});

module.exports = mongoose.model("Post", PostSchema);
