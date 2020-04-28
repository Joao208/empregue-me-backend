const mongoose = require('../../database')

const ImageSchema = new mongoose.Schema({
  name: String,
  size: Number,
  key: String,
});

const TextSchema = new mongoose.Schema({
  name: String,
  street: String,
  number: String,
  bairro: String,
  city: String,
  dateOfNasciment: String,
  cellPhone: String,
  academyFormation: String,
  qualifications: String,
  expirence: String,

})

const CurriculumSchema = new mongoose.Schema({
  Text: TextSchema,
  Image: ImageSchema,
  createdAd: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  },
  url: String,

})

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
      path.resolve(__dirname, "..", "..", "tmp", "uploads", this.key)
    );
  }
});


const Curriculum = mongoose.model('Curriculum', CurriculumSchema)

module.exports = Curriculum
