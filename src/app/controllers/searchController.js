const User = require('../models/user');
const Vacancies = require('../models/vacancies')
const Bussines = require('../models/bussines')
const ClassRoom = require('../models/classrom')

module.exports = {
  async index(req, res) {
    try {
      const {name} = req.params

      const users = await User.find({name:{$regex: name, $options:"i"}}).sort('-createdAt')
      const vacancies = await Vacancies.find({title:{$regex:name, $options:"i"}}).sort('-createdAt')
      const bussines = await Bussines.find({ nome: { $regex: name, $options: "i" } }).sort('-createdAt')

        return res.json({
          users,
          vacancies,
          bussines
        })

    } catch (e) {
      console.log(e)
      return res.status(400).send({
        error: 'Error em find user'
      })
    }
  },

  async store(req, res) {
    try {
      const {title} = req.params
      console.log(title)
      const vacancies = await Vacancies.find({title:{ $regex: title, $options: "i" } }).sort('-createdAt')

      return res.json(vacancies)

    } catch (e) {
      console.log(e)
      return res.status(400).send({
        error: 'Error em find vacancie'
      })
    }
  },

  async buss(req, res) {
    try {
      const nome = req.body

      const bussines = await Bussines.find({ nome: { $regex: nome, $options: "i" } }, function(err, docs) {
        console.log("Partial Search Begins");
        console.log(docs);
        })

      return res.json(bussines)

    } catch (e) {
      console.log(e)
      return res.status(400).send({
        error: 'Error em find bussines'
      })
    }
  },

  async class(req, res) {
    try {
      const nome = req.params.name

      const classrom = await ClassRoom.find({ classcourse: { $regex: nome, $options: "i" } }, function(err, docs) {
        console.log("Partial Search Begins");
        console.log(docs);
        })

      return res.json(classrom)

    } catch (e) {
      console.log(e)
      return res.status(400).send({
        error: 'Error em find bussines'
      })
    }
  }


}
