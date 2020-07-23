const express = require('express')
const routes = require('../routes')
const path = require('path')
const cors = require('cors');
const bodyParser = require('body-parser')
const socketio = require('socket.io');
const http = require('http');
const cookieParser = require('cookie-parser');

const app = express()


const server = http.Server(app);
const io = socketio(server);

const connectedUsers = {}

io.on('connection', socket =>{

const {user_id} = socket.handshake.query;

connectedUsers[user_id] = socket.id;
console.log(connectedUsers)
})

app.use((req, res, next) =>{
req.io = io;
req.connectedUsers = connectedUsers;

return next();
})

app.use(cors())


require("dotenv").config();

app.use(cookieParser());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(routes)

require('./app/controllers/authController')(app)
require('./app/controllers/profileController')(app)
require('./app/controllers/AddController')(app)
require('./app/controllers/CheckController')(app)
require('./app/controllers/FeedController')(app)
require('./app/controllers/FollowController')(app)
require('./app/controllers/NotificationController')(app)
require('./app/controllers/PostController')(app)
require('./app/controllers/SchoolController')(app)
require('./app/controllers/SujestionController')(app)
require('./app/controllers/UserController')(app)
require('./app/controllers/VacanciesController')(app)
require('./app/controllers/PostBController')(app)
require('./app/controllers/CurriculumController')(app)
require('./app/controllers/CheckoutController')(app)


server.listen(process.env.PORT || 3000)
