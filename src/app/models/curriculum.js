const mongoose = require("mongoose");
const aws = require("aws-sdk");
const s3 = new aws.S3();

const CurriculumSchema = new mongoose.Schema({
  name: String,
  size: Number,
  key: String,
  url: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
});

CurriculumSchema.pre("save", function() {
  if (!this.url) {
    this.url = `${process.env.APP_URL}/files/${this.key}`;
  }
});

CurriculumSchema.pre("remove", function() {
  if(this.key)
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
  });

module.exports = mongoose.model("Curriculum", CurriculumSchema);