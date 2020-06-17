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
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

require('./app/controllers/authController')(app)
require('./app/controllers/publishController')(app)
require('./app/controllers/profileController')(app)

server.listen(process.env.PORT || 3000)
