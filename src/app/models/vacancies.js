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
  description:String,
  salary:Number,
  uf:String,
  city:String,
  title:String,
})

const VacanciesSchema = new mongoose.Schema({
  approved: Boolean, 
  createdAt: {
    type: Date,
    default: Date.now
  },
  bussines: {
    require: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bussines'
  },
  image: ImageSchema,
  text: TextSchema,
  url: String,

});

ImageSchema.pre("save", function () {
  if (!this.url) {
    this.url = `${process.env.APP_URL}/files/${this.key}`;
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

module.exports = mongoose.model("Vacancies", VacanciesSchema);
