const express = require('express');
const bcrypt = require('bcryptjs')
const Bussines = require('../models/bussines')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const mailer = require('../../modules/mailer')
const multer = require("multer");
const multerConfig = require("../../config/multer");


const authConfig = require('../../config/auth.json')

const router = express.Router()

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  })
}

router.post('/userregister',async (req, res) => {
  const {input,email,password,latitude, longitude} = req.body

  try {
    if (await User.findOne({
        email
      }))
      return res.status(400).send({
        error: 'User already exists'
      })
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    const user = await User.create({
      input,
      email,
      password,
      location,
      url
    });

    user.password = undefined

    return res.send({
      user,
      token: generateToken({
        id: user.id
      })
    })

  } catch (err) {
    console.log(err)
    return res.status(400).send({
      errror: 'Registration failed'
    })

  }

})

router.post('/authenticate', async (req, res) => {
try{

  const {
    email,
    password
  } = req.body;

  const user = await User.findOne({
    email
  }).select('+password')

  if (!user)
    return res.status(400).send({
      error: 'User does not exist'
    })

  if (!await bcrypt.compare(password, user.password))
    return res.status(400).send({
      error: 'Senha invalida'
    })

  user.password = undefined

  res.send({
    user,
    token: generateToken({
      id: user.id
    })
  })
} catch(error) {
  console.log(err)
}
})

router.post('/bussinesauthenticate', async (req, res) => {
  const {
    email,
    password
  } = req.body;

  const bussines = await Bussines.findOne({
    email
  }).select('+password')

  if (!bussines)
    return res.status(400).send({
      error: 'Bussines does not exist'
    })

  if (!await bcrypt.compare(password, bussines.password))
    return res.status(400).send({
      error: 'Senha invalida'
    })

  bussines.password = undefined


  res.send({
    bussines,
    token: generateToken({
      id: bussines.id
    })
  })
})

router.get('/userregister', async (req, res) => {
  const user = await User.find();

  return res.json(user);
}, )

router.post('/forgot_password', async (req, res) => {
  const {
    email
  } = req.body

  try {

    const user = await User.findOne({
      email
    })

    if (!user)
      return res.status(400).send({
        error: 'User not found'
      })

    const token = crypto.randomBytes(20).toString('hex')

    const now = new Date();
    now.setHours(now.getHours() + 1)

    await User.findByIdAndUpdate(user.id, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: now
      }
    })


    mailer.sendMail({
      to: email,
      from: 'augustoj311@gmail.com',
      template: 'auth/forgot_password',
      context: {
        token
      }
    }, (err) => {
      if (err)
        return res.status(400).send({
          error: 'Cannot send forgot password email'
        })
      console.log(err)
      return res.send()
    })
  } catch (err) {
    console.log(err)
    res.status(400).send({
      error: 'Erro on forgot password, try again'
    })
  }

})

router.post('/forgot_password_bussines', async (req, res) => {
  const {
    email
  } = req.body

  try {

    const bussines = await Bussines.findOne({
      email
    })

    if (!bussines)
      return res.status(400).send({
        error: 'User not found'
      })

    const token = crypto.randomBytes(20).toString('hex')

    const now = new Date();
    now.setHours(now.getHours() + 1)

    await Bussines.findByIdAndUpdate(bussines.id, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: now
      }
    })


    mailer.sendMail({
      to: email,
      from: 'augustoj311@gmail.com',
      template: 'auth/forgot_password',
      context: {
        token
      }
    }, (err) => {
      if (err)
        return res.status(400).send({
          error: 'Cannot send forgot password email'
        })
      console.log(err)
      return res.send()
    })
  } catch (err) {
    console.log(err)
    res.status(400).send({
      error: 'Erro on forgot password, try again'
    })
  }

})

router.post('/reset_password', async (req, res) => {
  const {
    email,
    token,
    password
  } = req.body

  try {
    const user = await User.findOne({
        email
      })
      .select('+passwordResetToken passwordResetExpires')

    if (!user)
      return res.status(400).send({
        error: 'User does not exist'
      })

    if (token !== user.passwordResetToken)
      return res.status(400).send({
        error: 'Token invalid'
      })

    const now = new Date()

    if (now > user.passwordResetExpires)
      return res.status(400).send({
        error: 'Token expired, generated a new one'
      })

    user.password = password

    await user.save()

    res.send()
  } catch (err) {
    res.status(400).send({
      error: 'Cannot reset password try again'
    })
  }
})

router.post('/reset_password_bussines', async (req, res) => {
  const {
    email,
    token,
    password
  } = req.body

  try {
    const user = await Bussines.findOne({
        email
      })
      .select('+passwordResetToken passwordResetExpires')

    if (!user)
      return res.status(400).send({
        error: 'User does not exist'
      })

    if (token !== user.passwordResetToken)
      return res.status(400).send({
        error: 'Token invalid'
      })

    const now = new Date()

    if (now > user.passwordResetExpires)
      return res.status(400).send({
        error: 'Token expired, generated a new one'
      })

    user.password = password

    await user.save()

    res.send()
  } catch (err) {
    res.status(400).send({
      error: 'Cannot reset password try again'
    })
  }
})


module.exports = app => app.use('/auth', router)
