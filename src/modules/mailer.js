const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')

var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "7a2592f00563af",
    pass: "0e6ef08a938fa8"
  }
});
  const handlebarOptions = {
    viewEngine: {
      extName: '.html',
      partialsDir: path.resolve('./src/resources/mail/'),
      layoutsDir: path.resolve('./src/resources/mail/'),
      defaultLayout: '',
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
  }
  transport.use('compile', hbs(handlebarOptions))
  
  
  module.exports = transport