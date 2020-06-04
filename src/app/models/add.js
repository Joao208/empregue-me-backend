const mongoose = require("mongoose");
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const {
  promisify
} = require("util");

const s3 = new aws.S3();

const ImageSchema = new mongoose.Schema({
  name: String,
  size: Number,
  key: String,

})
const TextSchema = new mongoose.Schema({
  link:String,
  text:String
})

const AddSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  bussines: {
    require: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bussines'
  },
  text: TextSchema,
  likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  likeCount:{
    type:Number,
    default:0
  },
  comments: [{ type: mongoose.Schema.ObjectId, ref: "ComentAdd" }],
  commentCount:{
    type:Number,
    default:0
  },
  type:String,
  isVideo:Boolean

});

ImageSchema.pre("save", function () {
  if (!this.avatar) {
    this.avatar = `${process.env.APP_avatar}/files/${this.key}`;
  }
});

ImageSchema.pre("remove", function () {
  if ('local' === "s3") {
    return s3
      .deleteObject({
        Bucket: 'serverem',
        Key: this.key
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
      path.resolve(__dirname, "..", "..","..","tmp", "uploads", this.key)
    );
  }
});

module.exports = mongoose.model("Add", AddSchema);
