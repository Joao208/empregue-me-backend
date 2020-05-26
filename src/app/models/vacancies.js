const mongoose = require("mongoose");
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const {
  promisify
} = require("util");

const s3 = new aws.S3();

const TextSchema = new mongoose.Schema({
  description:String,
  salary:Number,
  uf:String,
  city:String,
  cargo:String,
  employment:String,
})

const VacanciesSchema = new mongoose.Schema({
  approved: Boolean, 
  title:String,
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
  avatar:String

});

VacanciesSchema.virtual('avatar_url').get(function() {
  return `${process.env.APP_URL}/files/${this.Avatar}`
})

VacanciesSchema.pre("remove", function () {
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


module.exports = mongoose.model("Vacancies", VacanciesSchema);
