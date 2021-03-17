//fix filezilla or mail goto sudo nano /etc/ssh/sshd_config
var contact_server = require("./server_files/contact_server");
var monkey = require("./server_files/monkey/monkey");
require("dotenv").config();
const https = require("https");
const http = require("http");
const fs = require("fs");
const express = require("express");
const app = express();
var favicon = require("serve-favicon");
var port = process.env.PORT;
var port2 = process.env.PORT2;

var path = require("path");

const options = {
  key: fs.readFileSync(".cert/key.key"),
  cert: fs.readFileSync(".cert/mattiasstroman_com.crt"),
};

var bodyParser = require("body-parser");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

app.use(favicon(path.join(__dirname, "public", "favicon", "favicon.ico")));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

//serves index page
app.get("/", (req, res) => {
  if (!req.secure) {
    res.redirect("https://" + req.headers.host + req.url); //force ssl
  }
  res.sendFile(__dirname + "/public/home.html");
});

//Used connection for https requests and socket communtication
var server = https.createServer(options, app).listen(port);
var io = require("socket.io")(server);

//exclusivly used to redirect to https
http.createServer(app).listen(port2);

//contact form function uses import from serverfunctions
app.post("/contact-information/", (req, res) => {
  var info = req.body;
  contact_server.info_check(
    res,
    info,
    process.env.EMAIL,
    process.env.EMAILPASS
  );
});

//main connection, handles all functions
io.on("connection", function (socket) {
  monkey.startServer(io, socket);

  socket.on("enterRoom", function (data) {
    monkey.startRoom(io, socket, data);
  });

  socket.on("shareName", function (data) {
    monkey.shareName(io, socket, data);
  });

  socket.on("startGame", function (data) {
    monkey.startGame(io, socket, 4);
  });
  socket.on("gameDataPlayer", function (data) {
    monkey.sendGameData(io, socket, data);
  });
  socket.on("endGame", function () {
    monkey.endGame(io, socket);
  });
  socket.on("leave", function () {
    //created function
    monkey.disconnect(io, socket);
  });
  socket.on("disconnecting", function () {
    //reserved function
    monkey.disconnect(io, socket);
  });
});
