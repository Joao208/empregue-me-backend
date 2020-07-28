  const multer = require("multer")
  const multerClass = require("../../config/multerclass")
  const authMiddleware = require('../middlewares/auth')
  const Class = require('../models/classrom')
  const School = require('../models/school')
  const express = require('express');
const User = require("../models/user")

  const router = express.Router()

  router.use(authMiddleware)

  router.post("/classroom", multer(multerClass).array("avatar"), async (req, res) => {
    try {
      const school = req.userId
      const avatar = req.files.map(files => files.location)
      const Text = req.body
      const classcourse = req.body.class

      const classd = await Class.create({
        avatar,
        Text,
        school,
        classcourse
      })

      return res.send(classd)

    } catch (e) {
      return res.send(e)
    }
  })
  router.post('/school/confirmate/:token', async (req, res) => {
    try {
      const {
        token
      } = req.params
      const user = await School.findOne({
        _id: req.userId
      })
      if (!user)
        return res.status(400).send({
          error: 'User does not exist'
        })

      if (token !== user.usertoken)
        return res.status(400).send({
          error: 'Token invalid'
        })

      const now = new Date()

      if (now > user.usertokenexpiress)
        return res.status(400).send({
          error: 'Token expired, generated a new one'
        })

      user.confirmate = true

      await user.save()

      return res.send(user)
    } catch (error) {
      console.log(error);
    }
  })
  router.get('/courses', async (req, res) => {
    try {
      const courses = await Class.find().populate('school')

      return res.send(courses)

    } catch (error) {
      console.log(error)
    }
  })
  router.get('/courses/:id', async (req, res) => {
    try {
      const courses = await Class.findById(req.params.id).populate('school')

      return res.send(courses)
    } catch (error) {
      console.log(error)
    }
  })
  router.post('/courses/:course_id', async (req, res) => {
    try {
      const courses = await Class.findById(req.params.course_id)

      const user = await User.findById(req.userId)

      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey('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');
      const msg = {
        to: user.email,
        from: 'contato@empregue-me.page',
        subject: 'Empregue.me a melhor plataforma de contratação',
        text: 'Empregue.me',
        html: `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="utf-8"> <!-- utf-8 works for most cases -->
            <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
            <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
            <meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
            <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->
            <link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700,700i" rel="stylesheet">
        <style>

        html,
        body {
            margin: 0 auto !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;
            background: #fff;
        }
        </style>
        </head>

        <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #222222;">
          <center style="width: 100%; background-color: #fff;">
            <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
              &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
            </div>
            <h2>Os receptivos links do curso comprado</h2>
            <a href=${courses.avatar}>${courses.avatar}</a>
            <p>Não compartilhe, compartilhar essa informação pode acarretar em processos judiciarios</p>
          </center>
        </body>
        </html>
         `,
      };
      sgMail.send(msg).then(() => {
        console.log('Message sent')
      }).catch((error) => {
        console.log(error.response.body)
        // console.log(error.response.body.errors[0].message)
      })

      if (courses.school === req.userId) return res.status(400).send({
        error: "Unable to update post."
      })

      const userAlreadyBuy = courses.users.some(users => users == users.id)

      if (userAlreadyBuy) {
        courses.users = courses.users.filter(users => users != users.id)
        courses.set({
          compras: courses.compras - 1
        })
      } else {
        courses.users.push(req.userId)
        courses.set({
          compras: courses.compras + 1
        })
      }

      courses.save()

      return res.send()
    } catch (error) {
      console.log(error)
    }
  })
  router.get('/courses/buyed/:id', async (req,res) => {
    try{
    const courses = await Class.findById(req.params.id)
    const buyed = true

    if (courses.users.indexOf(req.userId) !== -1) {
      return res.send({
        buyed
      })
    }
    return res.send()
    }catch(error){
      return console.log(error)
    }
  })

  module.exports = app => app.use(router)
