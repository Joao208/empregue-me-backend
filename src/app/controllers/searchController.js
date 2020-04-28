const User = require('../models/user');
const Vacancies = require('../models/vacancies')
const Bussines = require('../models/bussines')

module.exports = {
  // Buscar por todos os devs num raio de 10km
  // Filtrar por tecnologias
  async index(req, res) {
    try {
      const name = req.body

      const users = await User.find(name)

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
      const name = req.body

      const vacancies = await Vacancies.find(name)

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

      const bussines = await Bussines.find(nome)

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
