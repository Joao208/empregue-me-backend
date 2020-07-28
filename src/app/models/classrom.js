const mongoose = require("mongoose");
const aws = require("aws-sdk");

const s3 = new aws.S3();

const TextSchema = new mongoose.Schema({
  Description:String,
  Value:{
    type:Number,
    max:150,
    min:15,
  },
  Title:String,
})
const ClassRoomSchema = new mongoose.Schema({
  Text: TextSchema,
  classcourse:String,
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  avatar:[String],
  users: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  compras:{
    type:Number,
    default:0
  },

})

ClassRoomSchema.virtual('avatar_url').get(function() {
  return `${process.env.APP_URL}/files/${this.Avatar}`
})

ClassRoomSchema.pre("remove", function () {
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

module.exports = mongoose.model("ClassRoom", ClassRoomSchema);
