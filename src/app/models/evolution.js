const mongoose = require('../../database')

const EvolutionSchema = new mongoose.Schema({
    createdAt:{
        type:Date,
        default:Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
      },
    userEvolution:{
        type:Number,
        require:true
    }    
    //incrementar os outros inputs curriculo
})
  
const Evolution = mongoose.model('Evolution', EvolutionSchema)

module.exports = Evolution