  const multer = require("multer")
  const multerClass = require("../../config/multerclass")
  const authMiddleware = require('../middlewares/auth')
  const Class = require('../models/classrom')
  const School = require('../models/school')
  const express = require('express');
  const multerConfig = require('../../config/multerprofile')

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
  module.exports = app => app.use(router)
