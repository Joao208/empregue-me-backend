const mongoose = require('../../database')

const TaskSchema = new mongoose.Schema({
  school:{
      type:mongoose.Schema.ObjectId,
      ref:'School'
  },
  user:String,
  email:String,
  value:String
})

module.exports = mongoose.model("Task", TaskSchema);
