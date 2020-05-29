const mongoose = require("mongoose");
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const {
  promisify
} = require("util");

const s3 = new aws.S3();

const TextSchema = new mongoose.Schema({
  Description:String,
  Value:{
    type:Number,
    max:50,
    min:15,
  },
  Title:String
})
const ClassRoomSchema = new mongoose.Schema({
  Text: TextSchema,
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  avatar:[String],

})

ClassRoomSchema.virtual('avatar_url').get(function() {
  return `${process.env.APP_URL}/files/${this.Avatar}`
})

ClassRoomSchema.pre("remove", function () {
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

module.exports = mongoose.model("ClassRoom", ClassRoomSchema);
