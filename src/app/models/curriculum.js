const mongoose = require('../../database')

const TextSchema = new mongoose.Schema({

})

const CurriculumSchema = new mongoose.Schema({
  Text: TextSchema,
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
  avatar: String,
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

CurriculumSchema.virtual('avatar_url').get(function() {
  return `${process.env.APP_URL}/files/${this.Avatar}`
})

CurriculumSchema.pre("remove", function () {
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


const Curriculum = mongoose.model('Curriculum', CurriculumSchema)

module.exports = Curriculum
