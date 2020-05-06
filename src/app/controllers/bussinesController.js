const axios = require('axios');
const Bussines = require('../models/bussines');
const jwt = require('jsonwebtoken')

const authConfig = require('../../config/auth.json')

module.exports = {
  async index(request, response) {
    const bussines = await Bussines.find();

    return response.json(bussines);
  },

  async store(request, response) {
    function generateToken(params = {}) {
      return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
      })
    }    
    const {
      email,
      cnpj,
      password,
      createdAd,
      latitude, 
      longitude
    } = request.body;

    const location = {
      type: 'Point',
      coordinates: [longitude, latitude]
    }

    try {
      if (await Bussines.findOne({
          email
        }))
        return response.status(400).send({
          error: 'Bussines already exists'
        })
      const apiResponse = await axios.get(`https://www.sintegraws.com.br/api/v1/execute-api.php?token=190BE125-8564-4DCD-8083-D680733A480F&cnpj=${cnpj}&plugin=RF`);

      const cnpjI = apiResponse.data;


      const bussines = await Bussines.create({
        cnpj,
        email,
        password,
        createdAd,
        cnpjI,
        location
      });

      bussines.password = undefined

      return response.send({
        bussines,
        token: generateToken({
          id: bussines.id
        })
      })
  
  
    } catch (err) {
      console.log(err)
      return response.status(400).send({
        error: 'Registration failed'
      })

    }

  }

};