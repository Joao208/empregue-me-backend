const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')

var transport = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 25,
  auth: {
    user: "APIChave",
    pass: "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"
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