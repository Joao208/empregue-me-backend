const Dev = require('../models/user')

module.exports = {
  async index(request, response) {
    const {
      longitude,
      latitude
    } = request.body

    const devs = await Dev.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: 100000
        }
      }
    }).limit(5)

    console.log(`> /search: ${devs.length} results`)

    const numberusers = await devs.length

    response.json({
      devs,
      numberusers
    })
  }
}
