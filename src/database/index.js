const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://Joao:wdjj2312@empregue-me-zjyoq.mongodb.net/test?retryWrites=true&w=majority', 
{useNewUrlParser: true, 
useUnifiedTopology: true,
useFindAndModify:false,
useCreateIndex:true,
}
)
mongoose.Promise = global.Promise

module.exports = mongoose