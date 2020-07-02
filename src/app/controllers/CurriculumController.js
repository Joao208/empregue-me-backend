 const {
    Router
  } = require('express')
  const router = Router();
  const authMiddleware = require('../middlewares/auth')
  const Curriculum = require('../models/curriculum')
  const multer = require("multer")
  const multerConfig = require("../../config/multerCurriculum")

  router.use(authMiddleware)
  
  router.post("/add/curriculum", multer(multerConfig).single("file"), async (req, res) => {
    try{
    const {mimetype, originalname: name, size, key, location: url = "" } = req.file;
    console.log(mimetype)
    const post = await Curriculum.create({
      name,
      size,
      key,
      user:req.userId,
      url
    });
  
    return res.json(post);
  }catch(e){
    console.log(e)
  }
  });

  router.delete("/curriculum/:id", async (req, res) => {
    const post = await Curriculum.findById(req.params.id);
  
    await post.remove();
  
    return res.send();
  });

  router.get("/curriculums", async (req, res) => {
    const posts = await Curriculum.find({user:req.userId});
  
    return res.json(posts);
  });

  router.get("/curriculums/:id", async (req, res) => {
    const posts = await Curriculum.find({user:req.params.id});
  
    return res.json(posts);
  });

  module.exports = app => app.use(router)
  