const Class = require('../models/classrom')
const express = require('express');

const router = express.Router()

router.get('/courses', async (req, res) => {
  try {
    const courses = await Class.find().populate('school')

    return res.send(courses)

  } catch (error) {
    console.log(error)
  }
})

module.exports = app => app.use(router)
