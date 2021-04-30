require('dotenv').config()
require('./src/database/mongo_db')
const express = require('express');
const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const AppJwt = require('./src/util/app_jwt');

const app = express();
const options = { /* ... */ };
const server = http.createServer(app);

const io = require('socket.io')(server, options);

io.on('connection', socket => {
  console.log("Connection:", socket.id)
  socket.io = io
  verifyTokenSocket(socket);
  socket.on("disconnect", () => {
    console.log(`On Disconnect: ${socket.userInfo.fullName}`);
  })
});

server.listen(process.env.PORT, () => { console.log('Server listen on port:', process.env.PORT) });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./src/routes/web'));
app.use('/api', require('./src/routes/api'));

const languages = require('./src/languages/languages');
console.log('Hello:', languages.translation('hello', 'vi'))

async function verifyTokenSocket (socket) {
  let accessToken = socket.handshake.query.accessToken;
  if (!accessToken) {
    socket.disconnect();
    return;
  }
  const verified = await AppJwt.verifyToken(accessToken);
  if (!verified) {
    socket.disconnect();
    return;
  }
  const user = await User.findOne({ email: verified.payload.email });
  console.log(`On Connect: ${user.fullName}`);
  //Khởi tạo function tìm socket bằng user id
  socket.getSocketByUserID = (id) => {
    let allSockets = io.sockets.sockets
    let otherSocket = null
    if (allSockets) {
      otherSocket = Object.values(allSockets).find((s) => {
        if (s && s.userInfo && s.userInfo.id && s.userInfo.id == id) {
          return s
        }
      })
    }
    return otherSocket
  }

  //Kiểm tra nếu có login ở thiết bị khác thì disconnect
  let otherSocket = socket.getSocketByUserID(user.id)
  if (otherSocket) {
    otherSocket.disconnect();
  }

  //------------------------------------
  //Login thành công khởi tạo các control
  socket.userInfo = user;
  socket.emit('connect_verified', user);
  new SocketControl(socket);
}

module.exports = app;
