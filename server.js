const express = require('express')
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const socketsStatus = {}


app.use(express.static(`${__dirname}/html`))
app.use(express.static(`${__dirname}/html/css`))

app.get('/',(req, res) => {
    res.render(`${__dirname}/html/index.html`)
})

io.on("connection", function (socket) {
    const socketId = socket.id;
    socketsStatus[socket.id] = {};
  
  
    console.log("connect");
  
    socket.on("voice", function (data) {
  
      var newData = data.split(";");
      newData[0] = "data:audio/ogg;";
      newData = newData[0] + newData[1];
  
      for (const id in socketsStatus) {
  
        if (id != socketId && !socketsStatus[id].mute && socketsStatus[id].online)
          socket.broadcast.to(id).emit("send", newData);
      }
  
    });
  
    socket.on("userInformation", function (data) {
      socketsStatus[socketId] = data;
  
      io.sockets.emit("usersUpdate",socketsStatus);
    });
  
  
    socket.on("disconnect", function () {
      delete socketsStatus[socketId];
    });
  
  });

http.listen(3000,() => {
    console.log(`Online na porta 3000`)
})
