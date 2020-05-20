const User = require('../models/user');
const Vacancies = require('../models/vacancies')
const Bussines = require('../models/bussines')

module.exports = {
  // Buscar por todos os devs num raio de 10km
  // Filtrar por tecnologias
  async index(req, res) {
    try {
      const name = req.params
      console.log(name)
      const users = await User.find({ name: { $regex: `${name}`, $options: "i" } }, function(err, docs) {
        console.log("Partial Search Begins");
        console.log(docs);
        })

        return res.json(users)

    } catch (e) {
      console.log(e)
      return res.status(400).send({
        error: 'Error em find user'
      })
    }
  },

  async store(req, res) {
    try {
      const title = req.body
      console.log(title)
      const vacancies = await Vacancies.find({ title: { $regex: `${title}`, $options: "i" } }, function(err, docs) {
        console.log("Partial Search Begins")
        console.log(docs)
        })

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
  }

  // update (não atualizar github_username)
  // destroy
}
