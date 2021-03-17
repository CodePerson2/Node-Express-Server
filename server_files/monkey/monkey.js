//makes room for game to run in
//random and friend game

var switchNo = -1;
var roomno = 1;
var waitRoom = 0;
var num = 0;
var roomEmpty = true;

function makeRoom(io, socket) {
  if (roomEmpty) generateRoom();
  socket.join(waitRoom);

  //roomno++;
  //io.sockets.adapter.rooms
  return waitRoom;
}
function whoGetsBanana(io, socket, room) {
  let length = Array.from(
    io.sockets.adapter.rooms.get(Array.from(socket.rooms)[1])
  ).length;
  let sock = Array.from(
    io.sockets.adapter.rooms.get(Array.from(socket.rooms)[1])
  )[Math.floor(Math.random() * length)];

  setTimeout(function () {
    io.to(room).emit("whoGetsBanana", sock);
  }, 6000);
}

function generateRoomName() {
  var name = "";
  var charList =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charLength = charList.length;
  for (let i = 0; i < 5; i++) {
    name += charList.charAt(Math.floor(Math.random() * charLength));
  }
  return name;
}

function generateRoom() {
  roomEmpty = false;
  waitRoom = "room-" + generateRoomName();
}
module.exports = {
  startServer: function (io, socket) {
    num++;
    console.log("A user connected " + num);
    socket.on("hello", function () {
      socket.emit("connected", { ready: "Hello" });
    });
  },
  startRoom: function (io, socket, data) {
    var room;
    room = makeRoom(io, socket);
    io.to(Array.from(socket.rooms)[1]).emit("roomEntered", {
      name: data.name,
      socketid: socket.id,
      readyState: false,
      color: data.color,
    });
  },
  shareName: function (io, socket, data) {
    io.to(Array.from(socket.rooms)[1]).emit("roomEntered", {
      name: data.name,
      socketid: socket.id,
      readyState: data.readyState,
      color: data.color,
    });
  },

  //starts game with count down from 3 to 0
  startGame: function (io, socket, num) {
    generateRoom(); //change base room too new room on game start;
    setTimeout(function () {
      io.to(Array.from(socket.rooms)[1]).emit("gameStart", { num: num });
      if (num <= 0) {
        if (
          io.sockets.adapter.rooms.get(Array.from(socket.rooms)[1]) == undefined
        )
          return; //tell others to restart
        let firstSocket = Array.from(
          io.sockets.adapter.rooms.get(Array.from(socket.rooms)[1])
        )[0];
        if (firstSocket == socket.id)
          whoGetsBanana(io, socket, Array.from(socket.rooms)[1]);
        return;
      } else module.exports.startGame(io, socket, num - 1);
    }, 1300);
  },

  sendGameData: function (io, socket, data) {
    socket.to(Array.from(socket.rooms)[1]).emit("gameData", data);
  },

  endGame: function (io, socket) {
    io.in(Array.from(socket.rooms)[1]).emit("gameHasEnded");
  },

  disconnect: function (io, socket) {
    num--;
    io.to(Array.from(socket.rooms)[1]).emit("left", { socketid: socket.id });
    console.log("A user disconnected " + Array.from(socket.rooms)[1]);
  },
};
