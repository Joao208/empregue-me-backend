const {
  Router
} = require('express')

const Profile = require('../models/profile')
const Post = require('../models/post')
const Curriculum = require('../models/curriculum')
const authMiddleware = require('../middlewares/auth')
const multer = require("multer")
const multerConfig = require("../../config/multer")
const User = require('../models/user')
const Nexmo = require('nexmo')
const crypto = require('crypto')
const pdf = require('html-pdf')

const router = Router();

router.use(authMiddleware)

router.post("/curriculum", multer(multerConfig).single("file"), async (req, res) => {
  try {
    const {
      name,
      street,
      number,
      bairro,
      city,
      dateOfNasciment,
      cellPhone,
      academyFormation,
      qualifications,
      expirence,
    } = req.body
    const {
      location: avatar
    } = req.file
    const user = req.userId

    const curriculum = await Curriculum.create({
      name,
      street,
      number,
      bairro,
      city,
      dateOfNasciment,
      cellPhone,
      academyFormation,
      qualifications,
      expirence,
      user,
      avatar
    })

    var conteudo = `
		<h1>Curriculo Vitae</h1>		
		<div>
			<h2>Dados Pessoais</h2>			
				<div class="vcard">
				  <img src="https://debrasileiroparabrasileiro.com/wp-content/uploads/2019/01/15.jpg" alt="photo" />
         <span>${name}</span>
         <span>, Nascido em:${dateOfNasciment}</span>
         <span>, Celular:${cellPhone}</span>				
				<div>
				  <span>${city}</span>
          <span>,${bairro}</span>
          <span>,${street}</span>
          <span>,${number}</span>
				 </div>
				</div>
		</div>

		<div>
			<h2>Dados Profissionais</h2>
			
			<p><label>Empresa</label>${expirence}</p>
		</div>

		<div>
			<h2>Formação</h2>
			
			<p><label>Curso</label>${academyFormation}</p>
    </div>
    
    <div>
    <h2>Formação</h2>
    
    <p><label>Curso</label>${qualifications}</p>
    </div>

		
    `

    await pdf.create(conteudo, {}).toFile(`./${user}.pdf`, (err, response) => {
      if (err) {
        console.log(err)
      } else {
        console.log(response)
      }

    })

    return res.json(curriculum)

  } catch (e) {
    console.log(e)
    return res.status(400).send({
      error: 'Error in creating new curriculum'
    })
  }
});

router.post('/profile', multer(multerConfig).single("avatar"), async (req, res) => {
  try {

    const user = await User.findOne({
      _id: req.userId
    })

    if (!user)
      return res.status(400).send({
        error: 'User not found'
      })

    const {
      location: avatar = ""
    } = req.file

    const {
      FacebookUrl,
      InstagramUrl,
      TwitterUrl,
      YouTubeUrl,
      GithubUrl,
      bio,
    } = req.body

    await Profile.create({
      user
    })

    await User.findByIdAndUpdate(user.id, {
      '$set': {
        avatar,
        FacebookUrl,
        InstagramUrl,
        TwitterUrl,
        YouTubeUrl,
        GithubUrl,
        bio,
      }
    })

    return res.send(user)

  } catch (err) {
    console.log(err)
    res.status(400).send({
      error: 'Error on updte profile, try again'
    })
  }
})

router.get("/profileview", async (req, res) => {
  try {
    const user = (req.userId)
    const post = await Post.find({
      user: user
    }).populate('post').populate('user')
    const profile = await Profile.find({
      user: user
    }).populate('user').populate('profile')
    const curriculum = await Curriculum.find({
      user: user
    }).populate('curriculum')

    const profileuser = ({
      user,
      post,
      profile,
      curriculum,
    })


    if (profile === null)
      return res.send('User does not have a profile')

    return res.send(profileuser)

  } catch (e) {
    console.log(e)
    return res.status(400).send({
      error: 'Error in find user profile'
    })
  }
})

router.delete("/profile/:id", async (req, res) => {
  const profile = await Profile.findById(req.params.id);

  await profile.remove();

  return res.send();
});

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

    const token = crypto.randomBytes(4).toString('hex')

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
      error: 'Erro on add phone, try again'
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
      .select('+phonetoken phonetokenexpiress')

    if (!user)
      return res.status(400).send({
        error: 'User does not exist'
      })

    if (token !== user.phonetoken)
      return res.status(400).send({
        error: 'Token invalid'
      })

    const now = new Date()

    if (now > user.phonetokenexpiress)
      return res.status(400).send({
        error: 'Token expired, generated a new one'
      })


    await user.save()

    res.send()
  } catch (err) {
    res.status(400).send({
      error: 'Cannot confirm phone try again'
    })
  }
})




module.exports = app => app.use(router)