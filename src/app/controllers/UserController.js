const {
  Router
} = require('express')
const authMiddleware = require('../middlewares/auth')
const User = require('../models/user')
const router = Router();
const Nexmo = require('nexmo')
const stripe = require("stripe")("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");

router.use(authMiddleware)

router.get("/user", async (req, res) => {
  const userid = req.userId
  const user = await User.find({
    _id: userid
  });

  return res.send(user);
});
router.post('/user/confirmate/:token', async (req, res) => {
  try {
    const {
      token
    } = req.params
    const user = await User.findOne({
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
router.get('/userregister', async (req, res) => {
  const user = await User.find();

  return res.json({
    user,
    followersCount: user.followers.length,
    followingCount: user.following.length
  });
})
router.post('/addphone', async (req, res) => {
  const {
    phone
  } = req.body

  try {

    const user = await User.findOne({
      _id: req.userId
    })

    if (!user)
      return res.status(400).send({
        error: 'User not found'
      })

    const token = Math.floor(Math.random() * 999999);
    console.log(token)
    const now = new Date();
    now.setHours(now.getHours() + 1)

    await User.findByIdAndUpdate(user.id, {
      '$set': {
        phone: phone,
        phonetoken: token,
        phonetokenexpiress: now,
      }
    })


   const nexmo = new Nexmo({
      apiKey: '7c58d252',
      apiSecret: 'p1k7cHMvzZ1ts1B4',
    });

    const from = 'Empregue.me';
    const to = phone;
    const text = `Seu token Empregue.me: ${token}`;

    await nexmo.message.sendSms(from, to, text, (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        if (responseData.messages[0]['status'] === "0") {
          console.log("Message sent successfully.");
        } else {
          console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
        }
      }
    })

    return res.send()

  } catch (err) {
    console.log(err)
    res.status(400).send({
      error: 'Error on add phone, try again'
    })
  }

})
router.post('/confirmphone', async (req, res) => {
  const {
    phone,
    token,
  } = req.body

  try {
    const user = await User.findOne({
        phone
      })

    if (!user)
      return res.status(400).send({
        error: 'User does not exist'
      })

    if (token !== user.phonetoken){
      console.log(user.phonetoken)
      console.log(user)
      console.log(token)
      res.status(400).send({
        error: 'Token invalid'
      })
    }
    const now = new Date()

    if (now > user.phonetokenexpiress)
      return res.status(400).send({
        error: 'Token expired, generated a new one'
      })

    user.phoneConfirme = true

    await user.save()

    res.send()
  } catch (err) {
    res.status(400).send({
      error: 'Cannot confirm phone try again'
    })
  }
})
router.post('/user/premiun/create', async (req, res) => {
try {
  const user = await User.findById(req.userId)

  await stripe.checkout.sessions.retrieve(
    user.sessionId,
    async function(err, session) {
      if(err){
        user.Premium = false
        await user.save()
      }
      if(session){

        user.Premium = true
        await user.save()

        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey('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');
        const msg = {
          to: user.email,
          from: 'contato@empregue-me.page',
          subject: 'Empregue.me a melhor plataforma de contratação',
          text: 'Empregue.me',
          html: `
          <!DOCTYPE html>
          <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml"><head>
          <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
          <meta content="width=device-width" name="viewport">
          <!--[if !mso]><!-->
          <meta content="IE=edge" http-equiv="X-UA-Compatible">
          <!--<![endif]-->
          <title></title>
          <!--[if !mso]><!-->
          <!--<![endif]-->
          <style type="text/css">
              body {
                margin: 0;
                padding: 0;
              }

              table,
              td,
              tr {
                vertical-align: top;
                border-collapse: collapse;
              }

              * {
                line-height: inherit;
              }

              a[x-apple-data-detectors=true] {
                color: inherit !important;
                text-decoration: none !important;
              }
            </style>
          <style id="media-query" type="text/css">
              @media (max-width: 670px) {

                .block-grid,
                .col {
                  min-width: 320px !important;
                  max-width: 100% !important;
                  display: block !important;
                }

                .block-grid {
                  width: 100% !important;
                }

                .col {
                  width: 100% !important;
                }

                .col>div {
                  margin: 0 auto;
                }

                img.fullwidth,
                img.fullwidthOnMobile {
                  max-width: 100% !important;
                }

                .no-stack .col {
                  min-width: 0 !important;
                  display: table-cell !important;
                }

                .no-stack.two-up .col {
                  width: 50% !important;
                }

                .no-stack .col.num4 {
                  width: 33% !important;
                }

                .no-stack .col.num8 {
                  width: 66% !important;
                }

                .no-stack .col.num4 {
                  width: 33% !important;
                }

                .no-stack .col.num3 {
                  width: 25% !important;
                }

                .no-stack .col.num6 {
                  width: 50% !important;
                }

                .no-stack .col.num9 {
                  width: 75% !important;
                }

                .video-block {
                  max-width: none !important;
                }

                .mobile_hide {
                  min-height: 0px;
                  max-height: 0px;
                  max-width: 0px;
                  display: none;
                  overflow: hidden;
                  font-size: 0px;
                }

                .desktop_hide {
                  display: block !important;
                  max-height: none !important;
                }
              }
            </style>
          </head>
          <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
          <!--[if IE]><div class="ie-browser"><![endif]-->
          <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;" valign="top" width="100%">
          <tbody>
          <tr style="vertical-align: top;" valign="top">
          <td style="word-break: break-word; vertical-align: top;" valign="top">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
          <div style="background-color:#002dd9;">
          <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
          <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#002dd9;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
          <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:transparent;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:30px; padding-bottom:30px;"><![endif]-->
          <div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
          <div style="width:100% !important;">
          <!--[if (!mso)&(!IE)]><!-->
          <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:30px; padding-bottom:30px; padding-right: 0px; padding-left: 0px;">
          <!--<![endif]-->
          <div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">
          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><a href="http://example.com/" style="outline:none" tabindex="-1" target="_blank"> <img align="center" alt="Logo" border="0" class="center autowidth" src="https://serverem.s3.us-east-2.amazonaws.com/logo.PNG" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 112px; display: block;" title="Logo" width="112"></a>
          <!--[if mso]></td></tr></table><![endif]-->
          </div>
          <!--[if (!mso)&(!IE)]><!-->
          </div>
          <!--<![endif]-->
          </div>
          </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
          </div>
          </div>
          </div>
          <div style="background-color:#e4e4e4;">
          <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
          <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#e4e4e4;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
          <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:transparent;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
          <div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
          <div style="width:100% !important;">
          <!--[if (!mso)&(!IE)]><!-->
          <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
          <!--<![endif]-->
          <div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">
          <!--[if mso]></td></tr></table><![endif]-->
          </div>
          <!--[if (!mso)&(!IE)]><!-->
          </div>
          <!--<![endif]-->
          </div>
          </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
          </div>
          </div>
          </div>
          <div style="background-color:#e4e4e4;">
          <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
          <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;background-image:url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/1626/featured-area-background.png');background-position:top left;background-repeat:no-repeat">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#e4e4e4;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
          <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:transparent;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:25px;"><![endif]-->
          <div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
          <div style="width:100% !important;">
          <!--[if (!mso)&(!IE)]><!-->
          <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:25px; padding-right: 0px; padding-left: 0px;">
          <!--<![endif]-->
          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 45px; padding-left: 45px; padding-top: 45px; padding-bottom: 10px; font-family: sans-serif"><![endif]-->
          <div style="font-family: Raleway, &quot;Trebuchet MS&quot;, Helvetica, sans-serif; line-height: 1.2; padding: 45px 45px 10px;">
          <div style="line-height: 1.2; font-size: 12px; font-family: Raleway, &quot;Trebuchet MS&quot;, Helvetica, sans-serif;">
          <p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: center; margin: 0px;"><strong style=""><span style="font-size: 46px;"><span style="color: rgb(255, 255, 255);">Obrigado</span> por se tornar&nbsp;<font color="#ffffff">Premium Empregue.me</font></span></strong></p>
          </div>
          </div>
          <!--[if mso]></td></tr></table><![endif]-->
          <div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;"><span style="text-size-adjust: none; text-decoration: none; display: inline-block; color: rgb(0, 0, 0); background-color: transparent; border-radius: 10px; width: auto; border-width: 2px; border-style: solid; border-color: rgb(0, 0, 0); padding: 5px 30px; font-family: Raleway, &quot;Trebuchet MS&quot;, Helvetica, sans-serif; text-align: center; word-break: keep-all; font-size: 20px;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><span data-mce-style="font-size: 20px; line-height: 40px;" style="font-size: 20px; line-height: 40px;"><strong>Estamos com você</strong></span></span></span></div>
          <div align="right" class="img-container right autowidth" style="padding-right: 0px;padding-left: 0px;">
          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="right"><![endif]-->
          <!--[if mso]></td></tr></table><![endif]-->
          </div>
          <div class="mobile_hide">
          <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
          <tbody>
          <tr style="vertical-align: top;" valign="top">
          <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 35px; padding-right: 10px; padding-bottom: 35px; padding-left: 10px;" valign="top">
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;" valign="top" width="100%">
          <tbody>
          <tr style="vertical-align: top;" valign="top">
          <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
          </tr>
          </tbody>
          </table>
          </td>
          </tr>
          </tbody>
          </table>
          </div>
          <!--[if (!mso)&(!IE)]><!-->
          </div>
          <!--<![endif]-->
          </div>
          </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
          </div>
          </div>
          </div>
          <div style="background-color:#f2f1f1;">
          <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
          <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2f1f1;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
          <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:transparent;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:50px; padding-bottom:0px;"><![endif]-->
          <div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
          <div style="width:100% !important;">
          <!--[if (!mso)&(!IE)]><!-->
          <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:50px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
          <!--<![endif]-->
          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: sans-serif"><![endif]-->
          <div style="color:#000000;font-family:Raleway, Trebuchet MS, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
          <div style="line-height: 1.2; font-size: 12px; color: #000000; font-family: Raleway, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14px;">
          <p style="font-size: 46px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 55px; margin: 0;"><span style="font-size: 46px;"><strong>Quais são os beneficios?</strong></span></p>
          </div>
          </div>
          <!--[if mso]></td></tr></table><![endif]-->
          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: sans-serif"><![endif]-->
          <div style="color:#000000;font-family:Raleway, Trebuchet MS, Helvetica, sans-serif;line-height:1.5;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
          <div style="line-height: 1.5; font-size: 12px; color: #000000; font-family: Raleway, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 18px;">
          <p style="font-size: 18px; line-height: 1.5; word-break: break-word; text-align: center; mso-line-height-alt: 27px; margin: 0;">Agora com o Premium da plataforma você, vai poder: Enviar requisições para as empresas e ter uma chance significavelmente maior e ficar no topo da lista, vai poder acompanhar todos os novos recursos gratuitamente, inclusive o recurso de ia para analisar se você esta certo no caminho profissional ou não além de poder ver todos os cursos recomendados para você pela ia, vamos estar mais que nunca com você frequentemente querendo saber como você esta profissionalmente e se foi contratado, Empregue.me mais que nunca ao seu lado</p>
          </div>
          </div>
          <!--[if mso]></td></tr></table><![endif]-->
          <div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://example.com/" style="height:40.5pt; width:199.5pt; v-text-anchor:middle;" arcsize="19%" strokeweight="1.5pt" strokecolor="#002DD9" fillcolor="#002dd9"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:sans-serif; font-size:20px"><![endif]-->
          <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
          </div>
          <div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">
          <!--[if mso]></td></tr></table><![endif]-->
          </div>
          <!--[if (!mso)&(!IE)]><!-->
          </div>
          <!--<![endif]-->
          </div>
          </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
          </div>
          </div>
          </div>
          <div style="background-color:#ff0a52;">
          <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
          <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ff0a52;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
          <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:transparent;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:60px; padding-bottom:60px;"><![endif]-->
          <div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
          <div style="width:100% !important;">
          <!--[if (!mso)&(!IE)]><!-->
          <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:60px; padding-bottom:60px; padding-right: 0px; padding-left: 0px;">
          <!--<![endif]-->
          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: sans-serif"><![endif]-->
          <div style="color:#ffffff;font-family:Raleway, Trebuchet MS, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
          <div style="line-height: 1.2; font-size: 12px; color: #ffffff; font-family: Raleway, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14px;">
          <p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 17px; margin: 0;"><strong><span style="font-size: 46px;">Preço único</span></strong></p>
          </div>
          </div>
          <!--[if mso]></td></tr></table><![endif]-->
          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: sans-serif"><![endif]-->
          <div style="color:#ffffff;font-family:Raleway, Trebuchet MS, Helvetica, sans-serif;line-height:1.5;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
          <div style="line-height: 1.5; font-size: 12px; color: #ffffff; font-family: Raleway, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 18px;">
          <p style="font-size: 18px; line-height: 1.5; word-break: break-word; text-align: center; mso-line-height-alt: 27px; margin: 0;">Lhe oferecemos todos os recursos anteriores com o preço minimo de apenas R$3,00/mês, assim somos a unica plataforma de contratação e profissionalização que pensa em todos e quer vê-los com empregos, fazendo o que gosta e como gosta.&nbsp;</p>
          </div>
          </div>
          <!--[if mso]></td></tr></table><![endif]-->
          <div align="center" class="button-container" style="padding-top:15px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 15px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://example.com/" style="height:40.5pt; width:199.5pt; v-text-anchor:middle;" arcsize="19%" strokeweight="1.5pt" strokecolor="#FFFFFF" fill="false"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:sans-serif; font-size:20px"><![endif]-->
          <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
          </div>
          <!--[if (!mso)&(!IE)]><!-->
          </div>
          <!--<![endif]-->
          </div>
          </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
          </div>
          </div>
          </div>
          <div style="background-color:transparent;">
          <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
          <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
          <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:transparent;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:30px; padding-bottom:30px;"><![endif]-->
          <div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
          <div style="width:100% !important;">
          <!--[if (!mso)&(!IE)]><!-->
          <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:30px; padding-bottom:30px; padding-right: 0px; padding-left: 0px;">
          <!--<![endif]-->
          <table cellpadding="0" cellspacing="0" class="social_icons" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" valign="top" width="100%">
          <tbody>
          <tr style="vertical-align: top;" valign="top">

          </tr>
          </tbody>
          </table><div style="color:#9a9999;font-family:Raleway, Trebuchet MS, Helvetica, sans-serif;line-height:1.5;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;"><div style="line-height: 1.5; font-size: 12px; color: #9a9999; font-family: Raleway, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 18px;">
          <p style="font-size: 12px; line-height: 1.5; word-break: break-word; text-align: center; mso-line-height-alt: 18px; margin: 0;"><span style="font-size: 12px;"><br>© Copyright 2020 Lost Tech Softwares Ltda</span></p>
          </div>
          </div>
          <!--[if mso]></td></tr></table><![endif]-->
          <!--[if (!mso)&(!IE)]><!-->
          </div>
          <!--<![endif]-->
          </div>
          </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
          </div>
          </div>
          </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </td>
          </tr>
          </tbody>
          </table>
          <!--[if (IE)]></div><![endif]-->

          </body></html>
               `,
        };
        sgMail.send(msg).then(() => {
          console.log('Message sent')
        }).catch((error) => {
          console.log(error.response.body)
          // console.log(error.response.body.errors[0].message)
        })
      }
    }
  )

  res.send()

} catch (error) {
  console.log(error)
}
})
router.post('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if(user.id === req.userId){
      res.send()
    }else{
      res.status(400).send({error:'error'})
    }

  } catch (error) {
    console.log(error)
  }
})

module.exports = app => app.use(router)

