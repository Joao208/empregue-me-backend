const {
  Router
} = require('express')

const Profile = require('../models/profile')
const Post = require('../models/post')
const Curriculum = require('../models/curriculum')
const authMiddleware = require('../middlewares/auth')
const multer = require("multer")
const multerConfig = require("../../config/multerprofile")
const User = require('../models/user')
const Nexmo = require('nexmo')
const crypto = require('crypto')
const pdf = require('html-pdf')
const Bussines = require('../models/bussines')
const Add = require('../models/add')
const PostB = require('../models/postbussines')
const Vacancies = require('../models/vacancies')
const ProfileB = require('../models/profilebussines')
const router = Router()

router.use(authMiddleware)

router.post("/curriculum", multer(multerConfig).single("avatar"), async (req, res) => {
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

    const curriculumPdf = await pdf.create(conteudo, {}).toFile(`./${user}.pdf`, (err, response) => {
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
    const profile = await Profile.findOne({
      user: user
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

    if (profile === null) {
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
    } else {
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
    }
    return res.send(user)

  } catch (err) {
    console.log(err)
    res.status(400).send({
      error: 'Error on updte profile, try again'
    })
  }
})
router.post('/profilebussines', multer(multerConfig).single("avatar"), async (req, res) => {
  try {
    const bussines = await Bussines.findOne({
      _id: req.userId
    })
    const profile = await ProfileB.findOne({
      bussines: bussines
    })
    if (!bussines)
      return res.status(400).send({
        error: 'Bussines not found'
      })

    const {
      location: avatar = ""
    } = req.file

    const {
      bio,
      site,
    } = req.body

    if (profile === null) {
      await ProfileB.create({
        bussines,
      })

      await Bussines.findByIdAndUpdate(bussines.id, {
        '$set': {
          avatar,
          bio,
          site,
        }
      })
    } else {
      await Bussines.findByIdAndUpdate(bussines.id, {
        '$set': {
          avatar,
          bio,
          site,
        }
      })

    }
    return res.send(bussines)

  } catch (err) {
    console.log(err)
    res.status(400).send({
      error: 'Error on updte profile, try again'
    })
  }
})
router.get("/profilebussinesv", async (req, res) => {
  try {
    const bussines = await Bussines.findById(req.userId) 

    const post = await PostB.find({
       bussines:bussines
    }).sort('-createdAt').populate('post').populate('bussines')
    const profile = await ProfileB.find({
       bussines:bussines
    }).populate('bussines').populate('profile')
    const add = await Add.find({
      bbussines:bussines
    }).populate('add').populate('bussines').sort('-createdAt')
    const vacancies = await Vacancies.find({
      bussines:bussines
    }).populate('vacancies')

    const profileuser = ({
      followersCount: bussines.followers.length,
      followingCount: bussines.following.length,
      bussines,
      post,
      profile,
      add,
      vacancies
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
router.get("/profilebussinesv/:id", async (req, res) => {
  try {
    const bussines = await Bussines.findById(req.userId) 
    const post = await PostB.find({
      bussines: bussines
    }).sort('-createdAt').populate('post').populate('bussines')
    const profile = await ProfileB.find({
      bussines: bussines
    }).populate('bussines').populate('profile')
    const add = await Add.find({
      bussines: bussines
    }).sort('-createdAt').populate('add').populate('bussines')
    const vacancies = await Vacancies.find({
      bussines: bussines
    }).populate('vacancies')

    const profileuser = ({
      bussines,
      post,
      profile,
      add,
      vacancies,
      followersCount: bussines.followers.length,
      followingCount: bussines.following.length
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

router.get("/profileview", async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    const post = await Post.find({
      user: user
    }).sort('-createdAt').populate('post').populate('user')
    const profile = await Profile.find({
      user: user
    }).populate('user').populate('profile')
    const curriculum = await Curriculum.find({
      user: user
    }).populate('curriculum')

    if (profile === null)
    return res.send('User does not have a profile')
    
    return res.json({
      user,
      curriculum,
      post,
      profile,
      followersCount: user.followers.length,
      followingCount: user.following.length
    })

  } catch (e) {
    console.log(e)
    return res.status(400).send({
      error: 'Error in find user profile'
    })
  }
})
router.get("/profileview/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const post = await Post.find({
      user: user
    }).sort('-createdAt').populate('post').populate('user')
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
      followersCount: user.followers.length,
      followingCount: user.following.length
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
router.get('/sujestions',async(req, res) => {
  const {longitude,latitude} = req.query

  const users = await User.find({
      location: {
          $near: {
              $geometry: {
                  type: 'Point',
                  coordinates: [longitude, latitude]
              },
              $maxDistance: 10000
          }
      }
  }).limit(5)
  
  console.log(`> /search: ${users.length} results`)
  
  res.json(users)
})

router.post("/follow/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(400).json({
        error: 'usuario não existe '
      })
    }

    if (user.followers.indexOf(req.userId) !== -1) {
      return res
        .status(400)
        .json({
          error: `você já está seguindo ${user.name}`
        })
    }
    user.followers.push(req.userId)
    await user.save()

    /** following */
    const me = await User.findById(req.userId)

    me.following.push(req.userId)
    await me.save()

    const FolowUserSocket = req.connectedUsers[user .user];

    if (FolowUserSocket) {
      req.io.to(FolowUserSocket).emit('follow', user);
    }

    return res.json(me)
  } catch (err) {
    console.log(err)
    return res.status(400).send({
      error: "Error in follow user"
    })
  }
}
)

router.delete("/unfollow/:id",  async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(400).json({
        error: `usuario não existe`
      })
    }

    const following = user.followers.indexOf(req.userId)

    if (following === -1) {
      return res
        .status(400)
        .json({
          error: `você não está seguindo ${user.name}`
        })
    }

    user.followers.splice(following, 1)
    await user.save()

    const me = await User.findById(req.userId)
    console.log(me)
    me.following.splice(me.following.indexOf(user.id), 1)
    await me.save()

    const FolowUserSocket = req.connectedUsers[user .user];

    if (FolowUserSocket) {
      req.io.to(FolowUserSocket).emit('follow', user);
    }

    return res.json(me)
  } catch (err) {
    return res.send(err)
  }
}
)
router.post("/followb/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(400).json({
        error: 'usuario não existe '
      })
    }

    if (user.followers.indexOf(req.userId) !== -1) {
      return res
        .status(400)
        .json({
          error: `você já está seguindo ${user.name}`
        })
    }
    user.followers.push(req.userId)
    await user.save()

    /** following */
    const me = await Bussines.findById(req.userId)

    me.following.push(req.userId)
    await me.save()

    const FolowUserSocket = req.connectedUsers[user .user];

    if (FolowUserSocket) {
      req.io.to(FolowUserSocket).emit('follow', user);
    }

    return res.json(me)
  } catch (err) {
    console.log(err)
    return res.status(400).send({
      error: "Error in follow user"
    })
  }
}
)

router.delete("/unfollowb/:id",  async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(400).json({
        error: `usuario não existe`
      })
    }

    const following = user.followers.indexOf(req.userId)

    if (following === -1) {
      return res
        .status(400)
        .json({
          error: `você não está seguindo ${user.name}`
        })
    }

    user.followers.splice(following, 1)
    await user.save()

    const me = await Bussines.findById(req.userId)
    console.log(me)
    me.following.splice(me.following.indexOf(user.id), 1)
    await me.save()

    const FolowUserSocket = req.connectedUsers[user .user];

    if (FolowUserSocket) {
      req.io.to(FolowUserSocket).emit('follow', user);
    }

    return res.json(me)
  } catch (err) {
    return res.send(err)
  }
}
)


module.exports = app => app.use(router)
