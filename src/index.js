const express = require('express')
const routes = require('../routes')
const path = require('path')
const cors = require('cors');
const bodyParser = require('body-parser')
const socketio = require('socket.io');
const http = require('http');
const cookieParser = require('cookie-parser');
import * as Sentry from '@sentry/node';

const app = express()

Sentry.init({ dsn: 'https://598bf1f96aa44c638f360d19e8ed0074@o382729.ingest.sentry.io/5212042' });

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
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
app.use(Sentry.Handlers.errorHandler({
  shouldHandleError(error) {
    // Capture all 404 and 500 and 403 and 400 errors
    if (error.status === 404 || error.status === 500 || error.status === 400 || error.status === 503) {
      return true
    }
    return false
  }
}));

require('./app/controllers/authController')(app)
require('./app/controllers/publishController')(app)
require('./app/controllers/profileController')(app)

server.listen(process.env.PORT || 3000)
