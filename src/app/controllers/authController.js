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

    const token = crypto.randomBytes(6).toString('hex')

    const now = new Date();
    now.setHours(now.getHours() + 1)

    await User.findByIdAndUpdate(user.id, {
      '$set': {
        usertoken: token,
        usertokenexpiress: now
      }
    })

    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey('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');
    const msg = {
      to:email,
      from: 'augustoj311@gmail.com',
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
      
          <!-- CSS Reset : BEGIN -->
      <style>
      
      html,
      body {
          margin: 0 auto !important;
          padding: 0 !important;
          height: 100% !important;
          width: 100% !important;
          background: #f1f1f1;
      }
      
      /* What it does: Stops email clients resizing small text. */
      * {
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
      }
      
      /* What it does: Centers email on Android 4.4 */
      div[style*="margin: 16px 0"] {
          margin: 0 !important;
      }
      
      /* What it does: Stops Outlook from adding extra spacing to tables. */
      table,
      td {
          mso-table-lspace: 0pt !important;
          mso-table-rspace: 0pt !important;
      }
      
      /* What it does: Fixes webkit padding issue. */
      table {
          border-spacing: 0 !important;
          border-collapse: collapse !important;
          table-layout: fixed !important;
          margin: 0 auto !important;
      }
      
      /* What it does: Uses a better rendering method when resizing images in IE. */
      img {
          -ms-interpolation-mode:bicubic;
      }
      
      /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
      a {
          text-decoration: none;
      }
      
      /* What it does: A work-around for email clients meddling in triggered links. */
      *[x-apple-data-detectors],  /* iOS */
      .unstyle-auto-detected-links *,
      .aBn {
          border-bottom: 0 !important;
          cursor: default !important;
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
      }
      
      /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
      .a6S {
          display: none !important;
          opacity: 0.01 !important;
      }
      
      /* What it does: Prevents Gmail from changing the text color in conversation threads. */
      .im {
          color: inherit !important;
      }
      
      /* If the above doesn't work, add a .g-img class to any image in question. */
      img.g-img + div {
          display: none !important;
      }
      
      /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
      /* Create one of these media queries for each additional viewport size you'd like to fix */
      
      /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
      @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
          u ~ div .email-container {
              min-width: 320px !important;
          }
      }
      /* iPhone 6, 6S, 7, 8, and X */
      @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
          u ~ div .email-container {
              min-width: 375px !important;
          }
      }
      /* iPhone 6+, 7+, and 8+ */
      @media only screen and (min-device-width: 414px) {
          u ~ div .email-container {
              min-width: 414px !important;
          }
      }
      
      </style>
      
          <!-- CSS Reset : END -->
      
          <!-- Progressive Enhancements : BEGIN -->
      <style>
      
      .primary{
        background: #f3a333;
      }
      
      .bg_white{
        background: #ffffff;
      }
      .bg_light{
        background: #fafafa;
      }
      .bg_black{
        background: #000000;
      }
      .bg_dark{
        background: rgba(0,0,0,.8);
      }
      .email-section{
        padding:2.5em;
      }
      
      /*BUTTON*/
      .btn{
        padding: 10px 15px;
      }
      .btn.btn-primary{
        border-radius: 30px;
        background: #f3a333;
        color: #ffffff;
      }
      
      
      
      h1,h2,h3,h4,h5,h6{
        font-family: 'Playfair Display', serif;
        color: #000000;
        margin-top: 0;
      }
      
      body{
        font-family: 'Montserrat', sans-serif;
        font-weight: 400;
        font-size: 15px;
        line-height: 1.8;
        color: rgba(0,0,0,.4);
      }
      
      a{
        color: #f3a333;
      }
      
      .logo h1{
        margin: 0;
      }
      .logo h1 a{
        color: #000;
        font-size: 20px;
        font-weight: 700;
        text-transform: uppercase;
        font-family: 'Montserrat', sans-serif;
      }
      
      /*HERO*/
      .hero{
        position: relative;
      }
      .hero .text{
        color: rgba(255,255,255,.8);
      }
      .hero .text h2{
        color: #ffffff;
        font-size: 30px;
        margin-bottom: 0;
      }
      
      
      .heading-section h2{
        color: #000000;
        font-size: 28px;
        margin-top: 0;
        line-height: 1.4;
      }
      .heading-section .subheading{
        margin-bottom: 20px !important;
        display: inline-block;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: rgba(0,0,0,.4);
        position: relative;
      }
      .heading-section .subheading::after{
        position: absolute;
        left: 0;
        right: 0;
        bottom: -10px;
        content: '';
        width: 100%;
        height: 2px;
        background: #f3a333;
        margin: 0 auto;
      }
      
      .heading-section-white{
        color: rgba(255,255,255,.8);
      }
      .heading-section-white h2{
        font-size: 28px;
        line-height: 1;
        padding-bottom: 0;
      }
      .heading-section-white h2{
        color: #ffffff;
      }
      .heading-section-white .subheading{
        margin-bottom: 0;
        display: inline-block;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: rgba(255,255,255,.4);
      }
      
      
      .icon{
        text-align: center;
      }
      
      /*SERVICES*/
      .text-services{
        padding: 10px 10px 0; 
        text-align: center;
      }
      .text-services h3{
        font-size: 20px;
      }
      
      /*BLOG*/
      .text-services .meta{
        text-transform: uppercase;
        font-size: 14px;
      }
      
      /*TESTIMONY*/
      .text-testimony .name{
        margin: 0;
      }
      .text-testimony .position{
        color: rgba(0,0,0,.3);
      
      }
      
      
      /*VIDEO*/
      .img{
        width: 100%;
        height: auto;
        position: relative;
      }
      .img .icon{
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        bottom: 0;
        margin-top: -25px;
      }
      .img .icon a{
        display: block;
        width: 60px;
        position: absolute;
        top: 0;
        left: 50%;
        margin-left: -25px;
      }
      
      
      
      /*COUNTER*/
      .counter-text{
        text-align: center;
      }
      .counter-text .num{
        display: block;
        color: #ffffff;
        font-size: 34px;
        font-weight: 700;
      }
      .counter-text .name{
        display: block;
        color: rgba(255,255,255,.9);
        font-size: 13px;
      }
      
      
      /*FOOTER*/
      
      .footer{
        color: rgba(255,255,255,.5);
      
      }
      .footer .heading{
        color: #ffffff;
        font-size: 20px;
      }
      .footer ul{
        margin: 0;
        padding: 0;
      }
      .footer ul li{
        list-style: none;
        margin-bottom: 10px;
      }
      .footer ul li a{
        color: rgba(255,255,255,1);
      }
      
      
      @media screen and (max-width: 500px) {
      
        .icon{
          text-align: left;
        }
      
        .text-services{
          padding-left: 0;
          padding-right: 20px;
          text-align: left;
        }
      
      }
      
      </style>
      
      
      </head>
      
      <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #222222;">
        <center style="width: 100%; background-color: #f1f1f1;">
          <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
            &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
          </div>
          <div style="max-width: 600px; margin: 0 auto;" class="email-container">
            <!-- BEGIN BODY -->
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
              <tr>
                <td class="bg_white logo" style="padding: 1em 2.5em; text-align: center">
                  <h1><a href="https://light-empregue-me.herokuapp.com/">Empregue.me</a></h1>
                </td>
              </tr><!-- end tr -->
              <tr>
                <td valign="middle" class="hero" style="background-image: url(https://marcusmarques.com.br/wp-content/uploads/2017/04/capacitacao-de-empresarios.jpg); background-size: cover; height: 400px;">
                </td>
              </tr><!-- end tr -->
              <tr>
                <td class="bg_white">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td class="bg_dark email-section" style="text-align:center;">
                        <div class="heading-section heading-section-white">
                          <span class="subheading">Bem Vindo</span>
                          <h2>Bem vindo ao Empregue.me ${name}</h2>
                          <a href="https://light-empregue-me.herokuapp.com/confirmate/user/${token}" class="btn">Confirmar Email</a>
                        </div>
                      </td>
                    </tr><!-- end: tr -->
                    <tr>
                      <td class="bg_white email-section">
                        <div class="heading-section" style="text-align: center; padding: 0 30px;">
                          <span class="subheading">Nossos serviços</span>
                          <h2>Para Empresas e Usuarios</h2>
                        </div>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td valign="top" width="50%" style="padding-top: 20px;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td class="icon">
                                    <img src="https://images.vexels.com/media/users/3/144882/isolated/preview/a98fa07f09c1d45d26405fa48c344428-silhueta-de-constru----o-de-empresa-by-vexels.png" alt="" style="width: 60px; max-width: 600px; height: auto; margin: auto; display: block;">
                                  </td>
                                </tr>
                                <tr>
                                  <td class="text-services">
                                    <h3>Para Empresas</h3>
                                     <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem mollitia maiores ullam amet dolore facere, sed, corrupti officiis possimus architecto recusandae deleniti, at rem temporibus cumque dolores error. Ipsa, sit?</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td valign="top" width="50%" style="padding-top: 20px;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td class="icon">
                                    <img src="https://lh3.googleusercontent.com/proxy/e6ifWURfuoc5WvQi92kQaiftvENg1RjbYsfcJb0oh0eVCrHZIZ7Z1yTEISZmjhhoqYhXqwqhRgciwtNZ7POIuiTiR6ejx_DYRzHqTDdQ5GC3bgQMCjU" alt="" style="width: 60px; max-width: 600px; height: auto; margin: auto; display: block;">
                                  </td>
                                </tr>
                                <tr>
                                  <td class="text-services">
                                    <h3>Para Usuarios</h3>
                                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe sequi eveniet commodi! Nisi quisquam est dolorum, blanditiis sint deserunt doloremque, esse ea nostrum iure tempora ut, officia asperiores in ipsum.</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr><!-- end: tr -->
                    <tr>
                      <td class="bg_light email-section" style="text-align:center;">
                        <table>
                          <tr>
                            <td class="img">
                              <table>
                                <tr>
                                  <td>
                                    <img src="https://github.com/ColorlibHQ/email-templates/blob/master/1/images/bg_2.jpg?raw=true" width="600" height="" alt="alt_text" border="0" style="width: 100%; max-width: 600px; height: auto; margin: auto; display: block;" class="g-img">
                                  </td>
                                </tr>
                              </table>
                              <div class="icon">
                                <a href="#">
                                  <img src="https://github.com/ColorlibHQ/email-templates/blob/master/1/images/002-play-button.png?raw=true" alt="" style="width: 60px; max-width: 600px; height: auto; margin: auto; display: block;">
                                </a>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-top: 20px;">
                              <h2>Assista nosso video explicativo</h2>
                              <p>A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr><!-- end: tr -->
                  </table>
                </td>
              </tr><!-- end:tr -->
            <!-- 1 Column Text + Button : END -->
            </table>
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
              <tr>
                <td valign="middle" class="bg_black footer email-section">
                  <table>
                    <tr>
                      <td valign="top" width="33.333%" style="padding-top: 20px;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="text-align: left; padding-right: 10px;">
                              <h3 class="heading">Empregue.me</h3>
                              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Doloremque, ullam at provident sint a ab. Optio debitis repellat incidunt, dolorem vel nobis ex sunt distinctio fugiat autem possimus quam ipsam?</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td valign="top" width="33.333%" style="padding-top: 20px;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="text-align: left; padding-left: 5px; padding-right: 5px;">
                              <h3 class="heading">Contact Info</h3>
                              <ul>
                                <li><span class="text">203 Fake St. Mountain View, San Francisco, California, USA</span></li>
                                <li><span class="text">+2 392 3929 210</span></a></li>
                              </ul>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr><!-- end: tr -->
              <tr>
                <td valign="middle" class="bg_black footer email-section">
                  <table>
                    <tr>
                      <td valign="top" width="33.333%">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="text-align: left; padding-right: 10px;">
                              <p>&copy; 2020 Empregue.me. All Rights Reserved</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td valign="top" width="33.333%">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="text-align: right; padding-left: 5px; padding-right: 5px;">
                              <p><a href="#" style="color: rgba(230, 171, 9, 0.808);">Design by Lost Tech</a></p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
      
          </div>
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
      <!DOCTYPE html>
      <html lang="pt-br" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
          <meta charset="utf-8"> <!-- utf-8 works for most cases -->
          <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
          <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
          <meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
          <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->
      
      
          <link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700,700i" rel="stylesheet">
      
          <!-- CSS Reset : BEGIN -->
      <style>
      
      html,
      body {
          margin: 0 auto !important;
          padding: 0 !important;
          height: 100% !important;
          width: 100% !important;
          background: #f1f1f1;
      }
      
      /* What it does: Stops email clients resizing small text. */
      * {
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
      }
      
      /* What it does: Centers email on Android 4.4 */
      div[style*="margin: 16px 0"] {
          margin: 0 !important;
      }
      
      /* What it does: Stops Outlook from adding extra spacing to tables. */
      table,
      td {
          mso-table-lspace: 0pt !important;
          mso-table-rspace: 0pt !important;
      }
      
      /* What it does: Fixes webkit padding issue. */
      table {
          border-spacing: 0 !important;
          border-collapse: collapse !important;
          table-layout: fixed !important;
          margin: 0 auto !important;
      }
      
      /* What it does: Uses a better rendering method when resizing images in IE. */
      img {
          -ms-interpolation-mode:bicubic;
      }
      
      /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
      a {
          text-decoration: none;
      }
      
      /* What it does: A work-around for email clients meddling in triggered links. */
      *[x-apple-data-detectors],  /* iOS */
      .unstyle-auto-detected-links *,
      .aBn {
          border-bottom: 0 !important;
          cursor: default !important;
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
      }
      
      /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
      .a6S {
          display: none !important;
          opacity: 0.01 !important;
      }
      
      /* What it does: Prevents Gmail from changing the text color in conversation threads. */
      .im {
          color: inherit !important;
      }
      
      /* If the above doesn't work, add a .g-img class to any image in question. */
      img.g-img + div {
          display: none !important;
      }
      
      /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
      /* Create one of these media queries for each additional viewport size you'd like to fix */
      
      /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
      @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
          u ~ div .email-container {
              min-width: 320px !important;
          }
      }
      /* iPhone 6, 6S, 7, 8, and X */
      @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
          u ~ div .email-container {
              min-width: 375px !important;
          }
      }
      /* iPhone 6+, 7+, and 8+ */
      @media only screen and (min-device-width: 414px) {
          u ~ div .email-container {
              min-width: 414px !important;
          }
      }
      
      </style>
      
          <!-- CSS Reset : END -->
      
          <!-- Progressive Enhancements : BEGIN -->
      <style>
      
      .primary{
        background: #f3a333;
      }
      
      .bg_white{
        background: #ffffff;
      }
      .bg_light{
        background: #fafafa;
      }
      .bg_black{
        background: #000000;
      }
      .bg_dark{
        background: rgba(0,0,0,.8);
      }
      .email-section{
        padding:2.5em;
      }
      
      /*BUTTON*/
      .btn{
        padding: 10px 15px;
      }
      .btn.btn-primary{
        border-radius: 30px;
        background: #f3a333;
        color: #ffffff;
      }
      
      
      
      h1,h2,h3,h4,h5,h6{
        font-family: 'Playfair Display', serif;
        color: #000000;
        margin-top: 0;
      }
      
      body{
        font-family: 'Montserrat', sans-serif;
        font-weight: 400;
        font-size: 15px;
        line-height: 1.8;
        color: rgba(0,0,0,.4);
      }
      
      a{
        color: #f3a333;
      }
      
      .logo h1{
        margin: 0;
      }
      .logo h1 a{
        color: #000;
        font-size: 20px;
        font-weight: 700;
        text-transform: uppercase;
        font-family: 'Montserrat', sans-serif;
      }
      
      /*HERO*/
      .hero{
        position: relative;
      }
      .hero .text{
        color: rgba(255,255,255,.8);
      }
      .hero .text h2{
        color: #ffffff;
        font-size: 30px;
        margin-bottom: 0;
      }
      
      
      .heading-section h2{
        color: #000000;
        font-size: 28px;
        margin-top: 0;
        line-height: 1.4;
      }
      .heading-section .subheading{
        margin-bottom: 20px !important;
        display: inline-block;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: rgba(0,0,0,.4);
        position: relative;
      }
      .heading-section .subheading::after{
        position: absolute;
        left: 0;
        right: 0;
        bottom: -10px;
        content: '';
        width: 100%;
        height: 2px;
        background: #f3a333;
        margin: 0 auto;
      }
      
      .heading-section-white{
        color: rgba(255,255,255,.8);
      }
      .heading-section-white h2{
        font-size: 28px;
        line-height: 1;
        padding-bottom: 0;
      }
      .heading-section-white h2{
        color: #ffffff;
      }
      .heading-section-white .subheading{
        margin-bottom: 0;
        display: inline-block;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: rgba(255,255,255,.4);
      }
      
      
      .icon{
        text-align: center;
      }
      
      /*SERVICES*/
      .text-services{
        padding: 10px 10px 0; 
        text-align: center;
      }
      .text-services h3{
        font-size: 20px;
      }
      
      /*BLOG*/
      .text-services .meta{
        text-transform: uppercase;
        font-size: 14px;
      }
      
      /*TESTIMONY*/
      .text-testimony .name{
        margin: 0;
      }
      .text-testimony .position{
        color: rgba(0,0,0,.3);
      
      }
      
      
      /*VIDEO*/
      .img{
        width: 100%;
        height: auto;
        position: relative;
      }
      .img .icon{
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        bottom: 0;
        margin-top: -25px;
      }
      .img .icon a{
        display: block;
        width: 60px;
        position: absolute;
        top: 0;
        left: 50%;
        margin-left: -25px;
      }
      
      
      
      /*COUNTER*/
      .counter-text{
        text-align: center;
      }
      .counter-text .num{
        display: block;
        color: #ffffff;
        font-size: 34px;
        font-weight: 700;
      }
      .counter-text .name{
        display: block;
        color: rgba(255,255,255,.9);
        font-size: 13px;
      }
      
      
      /*FOOTER*/
      
      .footer{
        color: rgba(255,255,255,.5);
      
      }
      .footer .heading{
        color: #ffffff;
        font-size: 20px;
      }
      .footer ul{
        margin: 0;
        padding: 0;
      }
      .footer ul li{
        list-style: none;
        margin-bottom: 10px;
      }
      .footer ul li a{
        color: rgba(255,255,255,1);
      }
      
      
      @media screen and (max-width: 500px) {
      
        .icon{
          text-align: left;
        }
      
        .text-services{
          padding-left: 0;
          padding-right: 20px;
          text-align: left;
        }
      
      }
      
      </style>
      
      
      </head>
      
      <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #222222;">
        <center style="width: 100%; background-color: #f1f1f1;">
          <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
            &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
          </div>
          <div style="max-width: 600px; margin: 0 auto;" class="email-container">
            <!-- BEGIN BODY -->
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
              <tr>
                <td class="bg_white logo" style="padding: 1em 2.5em; text-align: center">
                  <h1><a href="https://light-empregue-me.herokuapp.com/">Empregue.me</a></h1>
                </td>
              </tr><!-- end tr -->
              <tr>
                <td valign="middle" class="hero" style="background-image: url(https://marcusmarques.com.br/wp-content/uploads/2017/04/capacitacao-de-empresarios.jpg); background-size: cover; height: 400px;">
                </td>
              </tr><!-- end tr -->
              <tr>
                <td class="bg_white">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td class="bg_dark email-section" style="text-align:center;">
                        <div class="heading-section heading-section-white">
                          <span class="subheading">Bem Vindo</span>
                          <h2>Bem vindo ao Empregue.me ${name}</h2>
                          <a href="https://light-empregue-me.herokuapp.com/confirmate/user/${token}" class="btn">Confirmar Email</a>
                        </div>
                      </td>
                    </tr><!-- end: tr -->
                    <tr>
                      <td class="bg_white email-section">
                        <div class="heading-section" style="text-align: center; padding: 0 30px;">
                          <span class="subheading">Nossos serviços</span>
                          <h2>Para Empresas e Usuarios</h2>
                        </div>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td valign="top" width="50%" style="padding-top: 20px;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td class="icon">
                                    <img src="https://images.vexels.com/media/users/3/144882/isolated/preview/a98fa07f09c1d45d26405fa48c344428-silhueta-de-constru----o-de-empresa-by-vexels.png" alt="" style="width: 60px; max-width: 600px; height: auto; margin: auto; display: block;">
                                  </td>
                                </tr>
                                <tr>
                                  <td class="text-services">
                                    <h3>Para Empresas</h3>
                                     <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem mollitia maiores ullam amet dolore facere, sed, corrupti officiis possimus architecto recusandae deleniti, at rem temporibus cumque dolores error. Ipsa, sit?</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td valign="top" width="50%" style="padding-top: 20px;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td class="icon">
                                    <img src="https://lh3.googleusercontent.com/proxy/e6ifWURfuoc5WvQi92kQaiftvENg1RjbYsfcJb0oh0eVCrHZIZ7Z1yTEISZmjhhoqYhXqwqhRgciwtNZ7POIuiTiR6ejx_DYRzHqTDdQ5GC3bgQMCjU" alt="" style="width: 60px; max-width: 600px; height: auto; margin: auto; display: block;">
                                  </td>
                                </tr>
                                <tr>
                                  <td class="text-services">
                                    <h3>Para Usuarios</h3>
                                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe sequi eveniet commodi! Nisi quisquam est dolorum, blanditiis sint deserunt doloremque, esse ea nostrum iure tempora ut, officia asperiores in ipsum.</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr><!-- end: tr -->
                    <tr>
                      <td class="bg_light email-section" style="text-align:center;">
                        <table>
                          <tr>
                            <td class="img">
                              <table>
                                <tr>
                                  <td>
                                    <img src="https://github.com/ColorlibHQ/email-templates/blob/master/1/images/bg_2.jpg?raw=true" width="600" height="" alt="alt_text" border="0" style="width: 100%; max-width: 600px; height: auto; margin: auto; display: block;" class="g-img">
                                  </td>
                                </tr>
                              </table>
                              <div class="icon">
                                <a href="#">
                                  <img src="https://github.com/ColorlibHQ/email-templates/blob/master/1/images/002-play-button.png?raw=true" alt="" style="width: 60px; max-width: 600px; height: auto; margin: auto; display: block;">
                                </a>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-top: 20px;">
                              <h2>Assista nosso video explicativo</h2>
                              <p>A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr><!-- end: tr -->
                  </table>
                </td>
              </tr><!-- end:tr -->
            <!-- 1 Column Text + Button : END -->
            </table>
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
              <tr>
                <td valign="middle" class="bg_black footer email-section">
                  <table>
                    <tr>
                      <td valign="top" width="33.333%" style="padding-top: 20px;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="text-align: left; padding-right: 10px;">
                              <h3 class="heading">Empregue.me</h3>
                              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Doloremque, ullam at provident sint a ab. Optio debitis repellat incidunt, dolorem vel nobis ex sunt distinctio fugiat autem possimus quam ipsam?</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td valign="top" width="33.333%" style="padding-top: 20px;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="text-align: left; padding-left: 5px; padding-right: 5px;">
                              <h3 class="heading">Contact Info</h3>
                              <ul>
                                <li><span class="text">203 Fake St. Mountain View, San Francisco, California, USA</span></li>
                                <li><span class="text">+2 392 3929 210</span></a></li>
                              </ul>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr><!-- end: tr -->
              <tr>
                <td valign="middle" class="bg_black footer email-section">
                  <table>
                    <tr>
                      <td valign="top" width="33.333%">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="text-align: left; padding-right: 10px;">
                              <p>&copy; 2020 Empregue.me. All Rights Reserved</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td valign="top" width="33.333%">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="text-align: right; padding-left: 5px; padding-right: 5px;">
                              <p><a href="#" style="color: rgba(230, 171, 9, 0.808);">Design by Lost Tech</a></p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
      
          </div>
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
