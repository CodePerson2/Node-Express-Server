import {makeGame, gameEnd} from './MonkeyMain.js';

//socket connection
//element of either racing vehicle
var socket = io.connect('/');
var notif = document.getElementById("notif");
var button = document.getElementById("game");
var name = document.getElementById("name");
var join = document.getElementById("join");
var leave = document.getElementById("leaveGame");
var ready = document.getElementById("ready");
var lobby = document.getElementById("lobby");
var list = document.getElementById("list");
var gameStart = document.getElementById("gameStart");
var menu = document.getElementById("main");
var room = [];
var readyState = false;
var gameBegun = false;
var lastColor = "";
var colorList = ["black", "white", "brown", "blue", "red", "yellow", "green", "purple", "pink", "orange"];

leave.addEventListener("click", leaveRoom);
ready.addEventListener("click", readyToStart);
button.addEventListener("click", enterRoom);

//notification system, used for server connected
function notification(mess){
    notif.innerHTML = mess;
    notif.style.opacity = 1;
    var view = notif.getBoundingClientRect()
    notif.style.top = (-view.top) + "px";
    setTimeout(function() { endNotif(); }, 4000);
    
}
//ends notification
function endNotif(){
    notif.innerHTML = "";
    notif.style.opacity = 0;
    notif.style.top = "-50px";
}
//run on page load to connect to server
function connect(){
    addEvent(colorList);

    gameBegun = false;
    readyState = false;

    socket.emit('hello');
    socket.on('connected', connectOff);
        
}
//stops original server connection
function connectOff(){
        
    socket.off('connected');
    notification("Connected To Server");
    
}
//enters room via server, then calls manageRoom to reset the lobby names in Arr
function enterRoom(){
    if(name.value == ""){
        notification("Fill in Name");
        return;
    }
    else if(lastColor == ""){
        notification("Choose a Color!");
        return;
    }
    leftRoom();
    join.style.display = "none";
    lobby.style.display = "block";
    socket.emit('enterRoom', {name: name.value, readyState: readyState, color: lastColor});
    socket.on('roomEntered', function(data){
        manageRoom(data);
    });
}
function exitRoom(){
    join.style.display = "block";
    lobby.style.display = "none";
    list.innerHTML = "";
}
//manages Arr values then rloads html elements via fillLobby
function manageRoom(data){
    var newM = true;
    for(let i = 0; i < room.length; i++){
        if(room[i].socketid == data.socketid){
            newM = false; 
            room[i].readyState = data.readyState;       //updates ready state of players
        }
    }
    if(newM){
        room.push(data);
        socket.emit('shareName', {name: name.value, readyState: readyState, color: lastColor});
    }
    fillLobby();
}
//removes left player from Arr calls fillLobby to relaod lobby
function leftRoom(){
    
    socket.on('left', function(data){
        for(let i = 0; i < room.length; i++)
        {
            if(room[i].socketid == data.socketid){
                room.splice(i, 1, room[room.length - 1])
                room.pop();
                fillLobby()
            }
        }
    });
}
//loads html elements into lobby 
function fillLobby(){
    list.innerHTML = "";
    for(let i = 0; i < room.length; i++){
        let rState = document.createElement("div");
        let entry = document.createElement("div");
        let border = document.createElement("div");

        rState.classList.add("main_l_list_ready");
        entry.classList.add("main_l_list_entry");
        border.classList.add("main_l_list_border");

        if(room[i].readyState == true){rState.innerHTML = "&#9745;"}
        else{rState.innerHTML = "&#9746;"; rState.style.color = "rgb(248, 86, 37)"}
        entry.innerHTML = room[i].name;
        if(room[i].socketid == socket.id){ entry.innerHTML += " (you)";}

        list.append(entry);
        list.append(rState);
        list.append(border);
        startGame();
    }
}
//shares readystate to all lobby players when player clicks ready
function readyToStart(){
    readyState = true;
    socket.emit('shareName', {name: name.value, readyState: readyState, color: lastColor});   //emits ready state when ready pressed
    recieveGameStart();
}
//resets connection and removes lobby when player leaves lobby page
function leaveRoom(){
    exitRoom();
    socket.emit('leave');
    room = [];
    readyState = false;
    socket = io.connect('/');
    connect();
}
//Start game when everybody is ready
function startGame(){
    for(let i = 0; i < room.length; i++){
        if(room[i].readyState == false || room.length <= 1)return;
    }
    if(gameBegun)return;
    gameBegun = true;
    socket.emit('startGame');
}

function recieveGameStart(){
    
    socket.on('gameStart', function (data){
        menu.style.visibility = "hidden";
        gameAnnounce(data.num);
        if(data.num == 0) {
            gameStart.style.visibility = "hidden";
            socket.off('gameStart');
            makeGame(socket, room);           //all communication in game happens in mankeymain from here
            endGameHandler();  //listens for game to end
        }
    });
    
}


function gameAnnounce(num){
    gameStart.style.visibility = "hidden";
    gameStart.innerHTML = "Game Starts in " + num + "...";
    gameStart.style.visibility = "visible";
}

function addEvent(id){
    for(let i = 0; i < id.length; i++){
        document.getElementById(id[i]).addEventListener("click", function(){
            chooseColor(id[i]);
        }, false);
    }
}

function chooseColor(id){
    if(lastColor != ""){
        let oldColor = document.getElementById(lastColor);

        oldColor.style.width = "35px";
        oldColor.style.height = "35px";
    }
    let color = document.getElementById(id);

    color.style.width = "25px";
    color.style.height = "25px";

    lastColor = id;
}


function endGameHandler(){
    var home = document.getElementById("home");
    home.addEventListener("click", function(){
        document.getElementById("results").style.display = "none";
        leaveRoom();
        menu.style.visibility = "visible";
    }, false);
    socket.on('gameHasEnded', function(){
        socket.off('gameHasEnded');
        gameEnd();
    });
}

connect();




