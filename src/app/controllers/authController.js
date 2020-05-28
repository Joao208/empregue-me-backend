const express = require('express');
const bcrypt = require('bcryptjs')
const Bussines = require('../models/bussines')
const User = require('../models/user')
const School = require('../models/school')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const multer = require("multer")
const multerConfig = require("../../config/multerprofile")

const authConfig = require('../../config/auth.json')

const router = express.Router()

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 864000
  })
}

router.post('/userregister', async (req, res) => {

  const {
    name,
    email,
    password,
    latitude,
    longitude
  } = req.body

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
      email,
      password,
      location,
      name
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
  try {

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
  } catch (error) {
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

  return res.json({
    user,
    followersCount: user.followers.length,
    followingCount: user.following.length
  });
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

    const token = crypto.randomBytes(6).toString('hex')

    const now = new Date();
    now.setHours(now.getHours() + 1)

    await User.findByIdAndUpdate(user.id, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: now
      }
    })


    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey('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');
    const msg = {
      to: 'augustoj311@gmail.com',
      from: email,
      subject: 'Empregue.me a melhor plataforma de contratação',
      text: 'Empregue.me',
      html: `
      <html lang="pt-br">
      <head>
        <title>Reset password Empregue.me</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
      
        <style>
      
        .btn{
        height:40px;
        border-radius:10px;
        width:120px;
        color:black;
        background-color:yellow;
        font-size:10;
        font-weight: 700;
        align-items: center;
        justify-content:center
        }
        .h1{
        text-align: center;
        }
        .p{
          text-align:center;
        }
        a{
          align-items:center;
          justify-content:center
        }
        .copyright{
          margin-top:39px
        }
        .jumbotron{
          align-items:center;
          justify-content:center
        }
        div{
          align-items:center;
          text-align:center;
          justify-content:center
        }
      img{
        width:50%;
        right:50%;
        margin-left:25%;
      }
        </style>
      
      <div class="jumbotron text-center" style="margin-bottom:0">
        <h1 class="h1">Seu token:${token}</h1>
        <p class="p">Não o compartilhe com ninguém</p> 
       <a href="https://light-empregue-me.herokuapp.com/reset-password"><button type="button" class="btn btn-warning">Resetar senha</button> </a>
      </div>
      <img src="https://cdlempregos.cdl-sc.org.br/projeto-site/img/texto_principal.png" alt="Emprego logo">
      
                <div class="copyright">
                  &copy; Copyright <strong>Empregue.me</strong>. All Rights Reserved
                </div>
                <div class="credits">
                  Designed by <a href="https://lostech.site/">Lost Tech</a>
                </div>
      </div>
      
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
    return res.send()
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


    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey('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');
    const msg = {
      to: 'augustoj311@gmail.com',
      from: email,
      subject: 'Empregue.me a melhor plataforma de contratação',
      text: 'Empregue.me',
      html: `
      <html lang="pt-br">
      <head>
        <title>Reset password Empregue.me</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
      
        <style>
      
        .btn{
        height:40px;
        border-radius:10px;
        width:120px;
        color:black;
        background-color:yellow;
        font-size:10;
        font-weight: 700;
        align-items: center;
        justify-content:center
        }
        .h1{
        text-align: center;
        }
        .p{
          text-align:center;
        }
        a{
          align-items:center;
          justify-content:center
        }
        .copyright{
          margin-top:39px
        }
        .jumbotron{
          align-items:center;
          justify-content:center
        }
        div{
          align-items:center;
          text-align:center;
          justify-content:center
        }
      img{
        width:50%;
        right:50%;
        margin-left:25%;
      }
        </style>
      
      <div class="jumbotron text-center" style="margin-bottom:0">
        <h1 class="h1">Seu token:${token}</h1>
        <p class="p">Não o compartilhe com ninguém</p> 
       <a href="https://light-empregue-me.herokuapp.com/reset-password"><button type="button" class="btn btn-warning">Resetar senha</button> </a>
      </div>
      <img src="https://cdlempregos.cdl-sc.org.br/projeto-site/img/texto_principal.png" alt="Emprego logo">
      
                <div class="copyright">
                  &copy; Copyright <strong>Empregue.me</strong>. All Rights Reserved
                </div>
                <div class="credits">
                  Designed by <a href="https://lostech.site/">Lost Tech</a>
                </div>
      </div>
      
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
    return res.send()
    
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
router.post('/schoolregister', multer(multerConfig).single("avatar") ,async (req, res) => {
  const {
    name,
    email,
    password,
    latitude,
    longitude,
    bio
  } = req.body
  const {
    location:avatar = ''
  } = req.file

  try {
    if (await School.findOne({
        email
      }))
      return res.status(400).send({
        error: 'School already exists'
      })
    const location = {
      type: 'Point',
      coordinates: [longitude, latitude]
    }
    const user = await School.create({
      email,
      password,
      location,
      name,
      avatar,
      bio
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
router.post('/school/authenticate', async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;
    const user = await School.findOne({
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
  } catch (error) {
    console.log(err)
  }
})
router.post('/school/reset_password', async (req, res) => {
  const {
    email,
    token,
    password
  } = req.body

  try {
    const user = await School.findOne({
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
router.post('/school/forgot_password', async (req, res) => {
  const {
    email
  } = req.body

  try {

    const user = await School.findOne({
      email
    })

    if (!user)
      return res.status(400).send({
        error: 'User not found'
      })

    const token = crypto.randomBytes(6).toString('hex')

    const now = new Date();
    now.setHours(now.getHours() + 1)

    await User.findByIdAndUpdate(user.id, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: now
      }
    })


    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey('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');
    const msg = {
      to: 'augustoj311@gmail.com',
      from: email,
      subject: 'Empregue.me a melhor plataforma de contratação',
      text: 'Empregue.me',
      html: `
      <html lang="pt-br">
      <head>
        <title>Reset password Empregue.me</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
      
        <style>
      
        .btn{
        height:40px;
        border-radius:10px;
        width:120px;
        color:black;
        background-color:yellow;
        font-size:10;
        font-weight: 700;
        align-items: center;
        justify-content:center
        }
        .h1{
        text-align: center;
        }
        .p{
          text-align:center;
        }
        a{
          align-items:center;
          justify-content:center
        }
        .copyright{
          margin-top:39px
        }
        .jumbotron{
          align-items:center;
          justify-content:center
        }
        div{
          align-items:center;
          text-align:center;
          justify-content:center
        }
      img{
        width:50%;
        right:50%;
        margin-left:25%;
      }
        </style>
      
      <div class="jumbotron text-center" style="margin-bottom:0">
        <h1 class="h1">Seu token:${token}</h1>
        <p class="p">Não o compartilhe com ninguém</p> 
       <a href="https://light-empregue-me.herokuapp.com/reset-password"><button type="button" class="btn btn-warning">Resetar senha</button> </a>
      </div>
      <img src="https://cdlempregos.cdl-sc.org.br/projeto-site/img/texto_principal.png" alt="Emprego logo">
      
                <div class="copyright">
                  &copy; Copyright <strong>Empregue.me</strong>. All Rights Reserved
                </div>
                <div class="credits">
                  Designed by <a href="https://lostech.site/">Lost Tech</a>
                </div>
      </div>
      
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
    return res.send()
    } catch (err) {
    console.log(err)
    res.status(400).send({
      error: 'Erro on forgot password, try again'
    })
  }

})



module.exports = app => app.use('/auth', router)
