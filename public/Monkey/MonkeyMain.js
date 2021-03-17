import {bananaDefine, Player, Opponent, Banana, Score, Timer, Result} from './objects.js';

var socket; //connection to server
var room; //server room information of all players in game {id}
var gameManager; // holds values of each player for location and game info;
var config;
var game;
var control;
var player;
var bananas;
var platforms;
var gameOver;
var h;
var w;
var color = "brown"; //players color
var hasBanana;
var opponentBanana;
var score;
var timer;
var gameLength = 59;
var tmpHand;

function makeGame(s, r)
{
    gameManager = [];
    gameOver = false;
    h = window.innerHeight;
    w = window.innerWidth;
    hasBanana = undefined;
    opponentBanana = undefined;

    socket = s;
    room = r;
    makePlayerManager(); // makes the gameManager array


    if(h < w)
    {
        h = h;
        w = h;
    }
    else if(h > w)
    {
        w = w;
        h = w;
    }
    
    config = 
    {
        type: Phaser.CANVAS,
        width: w,
        height: h,
        physics: 
        {
            default: 'arcade',
            arcade: {
                gravity: { y: w*1.5 },
                debug: false
            }
        },
        scene: 
        {
            preload: preload,
            create: create,
            update: update
        },
        antialias: false
    };

    game = new Phaser.Game(config);
}



function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform-l.png');
    this.load.image('ground-m', 'assets/platform-m.png');
    this.load.image('ground-s', 'assets/platform-s.png');
    this.load.spritesheet('brown', 'assets/monkey-brown.png', { frameWidth: 10, frameHeight: 18 });
    this.load.spritesheet('blue', 'assets/monkey-blue.png', { frameWidth: 10, frameHeight: 18 });
    this.load.spritesheet('black', 'assets/monkey-black.png', { frameWidth: 10, frameHeight: 18 });
    this.load.spritesheet('green', 'assets/monkey-green.png', { frameWidth: 10, frameHeight: 18 });
    this.load.spritesheet('yellow', 'assets/monkey-yellow.png', { frameWidth: 10, frameHeight: 18 });
    this.load.spritesheet('red', 'assets/monkey-red.png', { frameWidth: 10, frameHeight: 18 });
    this.load.spritesheet('white', 'assets/monkey-white.png', { frameWidth: 10, frameHeight: 18 });
    this.load.spritesheet('purple', 'assets/monkey-purple.png', { frameWidth: 10, frameHeight: 18 });
    this.load.spritesheet('orange', 'assets/monkey-orange.png', { frameWidth: 10, frameHeight: 18 });
    this.load.spritesheet('pink', 'assets/monkey-pink.png', { frameWidth: 10, frameHeight: 18 });
    this.load.spritesheet('banana', 'assets/banana.png', { frameWidth: 9, frameHeight: 9 });
}

function create ()
{
    //assumed
    control = this;

    //  A simple background for our game
    var background = this.add.image(400, 300, 'sky');
    background.scaleX = w/background.width;
    background.x = w/2;
    background.scaleY = h/background.height;
    background.y = h/2;

    //background.resize(window.height, window.height);
    var platList = [{x: w/2, y: h, tag: 'ground', scale: 1}, {x: w/2, y: h/1.2, tag: 'ground', scale: .5},
     {x: w/10, y: h/1.5, tag: 'ground-m', scale: .25}, {x: w/1.3, y: h/1.5, tag: 'ground-m', scale: .25}, {x: w, y: h/1.2, tag: 'ground-s', scale: .125}, 
     {x: w/1.75, y: h/1.9, tag: 'ground-s', scale: .125}, {x: w/1.2, y: h/2.9, tag: 'ground-s', scale: .125}, {x: w/2.3, y: h/1.5, tag: 'ground-s', scale: .125}, 
     {x: w/7, y: h/2, tag: 'ground-s', scale: .125}, {x: w/1.8, y: h/6.7, tag: 'ground-m', scale: .25}, {x: w/6, y: h/2, tag: 'ground-s', scale: .125}, 
     {x: w/5, y: h/3.2, tag: 'ground-m', scale: .25}, {x: w/1.75, y: h/3, tag: 'ground-s', scale: .125}, {x: w, y: h/2, tag: 'ground-s', scale: .125},
     {x: w, y: h/5.2, tag: 'ground-s', scale: .125}];
    createPlatform(platList, this);

    bananas = bananaDefine(this); //define banana

    createOpponents();

    player = new Player(this, Phaser, bananas, w, this.input.mousePointer); //define and create player
    player.createPlayer({x: w/2, y: w/1.4}, color);
    player.createInput();

    whoGetsBanana(); // who gets the banana first

    getPlayerData(); // starts listening for other players loc

    score = new Score(room);
    score.makeScore();

    timer = new Timer();
    
    document.getElementById("throw").addEventListener("touchstart", function(){
        player.buttonThrow();
    });

    document.getElementById("jump").addEventListener("touchstart", function(){
        player.buttonJump();
    });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player.player, platforms);
    this.physics.add.collider(bananas, bananas, function (bananas){
        bananas.anims.stop(null, true);
        bananas.setVelocityX(0);
    });
    
    
    //Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    //this.physics.add.overlap(player, bananas, collectBananas, null, this);

    this.physics.add.collider(bananas, [platforms, this.physics.worldBounds], function (bananas){
        bananas.anims.stop(null, true);
        bananas.anims.play('banana', true);
        bananas.setVelocityX(bananas.body.velocity.x * 0.6);
        control.physics.add.overlap(player.player, bananas, function(){    collectBananas(player, bananas);}, null, this); //only used if player has banana
    });

    opponentBanana = bananas.create(100, 100, 'banana');
    opponentBanana.setScale(w/opponentBanana.width * 0.05);
    opponentBanana.setCollideWorldBounds(true);
    opponentBanana.visable = false;
    opponentBanana.alpha = 0;
    opponentBanana.setPosition(-w/9,-w/9);
    opponentBanana.setDepth(4);
    bananas.remove(opponentBanana, false, false);
}

function update ()
{
    if (gameOver)
    {
        return;
    }
    opponentLoc();
    score.updateScore(gameManager);
    
    player.move();

    if(socket.id == hasBanana)  tmpHand = player.has_Banana();
    else tmpHand = true;
    
    socket.emit("gameDataPlayer", {id: socket.id, name: room[0].name, direction: player.getDirection(), x: player.player.x/w, y: player.player.y/w, 
        playerHasBanana: hasBanana, bananaInHand: tmpHand, bananaAnim: player.getbananaAnim(), bananaLoc: player.bananaLoc(), time: timer.getTime(hasBanana, socket.id)});
    //correct class to accomadate emiting data to server
}

function collectBananas(p, banana)
{
    
    if(socket.id != hasBanana) return;
    if(p == player){
        player.deleteThrownBanana();
        p.gotBanana();
        
    }
    else {
        hasBanana = p.id;
        p.bananaInHand = true;
        p.bananaLoc.x = -1;
        player.deleteThrownBanana();
        timer.endTimer();
    }
}

function createPlatform(platformsArr, phase)
{
    //  The platforms group contains the ground and the 2 ledges we can jump on
    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms = phase.physics.add.staticGroup();
    
    platformsArr.forEach( plat =>
        eachPlatform(plat)
    );
}
function eachPlatform(plat){
    var p = platforms.create(plat.x, plat.y, plat.tag);
    p.setScale((plat.scale * w/p.width)).refreshBody()
}
function makePlayerManager(){
    for(let i = 0; i < room.length; i++){
        gameManager.push({id: room[i].socketid, name: room[i].name, color: room[i].color, direction: 0, x: 0, y: 0,
             playerHasBanana: undefined, bananaInHand: true, bananaAnim: false, bananaLoc: {x:0, y:0}, time: 0});
        
    }
}
function getPlayerData(){
    socket.on("gameData", function (data){

        for(let i = 0; i < gameManager.length; i++){
            if(gameManager[i].id == data.id && data.id != socket.id){
                gameManager[i].direction = data.direction;
                gameManager[i].x = data.x;
                gameManager[i].y = data.y;
                gameManager[i].time = data.time;
                gameManager[i].bananaInHand = data.bananaInHand;
                gameManager[i].bananaLoc = data.bananaLoc;
                gameManager[i].bananaAnim = data.bananaAnim;

                if(data.playerHasBanana == undefined) return;
                if(gameManager[i].playerHasBanana != data.playerHasBanana && gameManager[i].id == hasBanana){
                    
                    hasBanana = data.playerHasBanana;
                    gameManager[i].playerHasBanana = data.playerHasBanana;
                    
                    if(socket.id == hasBanana){
                        player.gotBanana();
                        opponentBanana.visable = false;
                        opponentBanana.alpha = 0;
                        opponentBanana.setPosition(w/9,w/9);
                        timer.startTimer();
                    }
                    for(let j = 0; j < gameManager.length; j++){
                        gameManager[j].playerHasBanana = hasBanana;
                    }
                }
                
                else if(gameManager[i].playerHasBanana != gameManager[i].id){
                    gameManager[i].player.removeBanana();
                }

                    
            }
            if(gameManager[i].id == socket.id){      //update own time
                gameManager[i].time = timer.getTime(hasBanana, socket.id);

                if(gameManager[i].time > gameLength){    //replace 6 with gameLength when done testing
                    socket.emit("gameDataPlayer", {id: socket.id, name: room[0].name, direction: player.getDirection(), x: player.player.x/w, y: player.player.y/w, 
                        playerHasBanana: hasBanana, bananaInHand: player.has_Banana(), bananaAnim: player.getbananaAnim(), bananaLoc: player.bananaLoc(), time: timer.getTime(hasBanana, socket.id)});
                    socket.emit("endGame");     //game has Ended
                }
            }
            
        }
    });
}
function createOpponents(){
    for(let i = 0; i < gameManager.length; i++){
        if(gameManager[i].id != socket.id){
            gameManager[i].player = new Opponent(control, Phaser, bananas, w);
            gameManager[i].player.createPlayer({x: w/3, y: w/4}, gameManager[i].color, gameManager[i].name);
            control.physics.add.collider(gameManager[i].player.player, platforms);
            control.physics.add.overlap(gameManager[i].player.player, bananas, function(){    collectBananas(gameManager[i], bananas);}, null, this);
        }
        else if(gameManager[i].id == socket.id){    //make players color
            color = gameManager[i].color;
        }
    }
    
}
function opponentLoc(){
    for(let i = 0; i < gameManager.length; i++){
        if(gameManager[i].id != socket.id){
            gameManager[i].player.move({x: gameManager[i].x*w, y: gameManager[i].y*w, direction: gameManager[i].direction});
        }
        checkAllBananaInfo(gameManager[i]);
    }
}
function whoGetsBanana(){
    socket.on("whoGetsBanana", function (data){
        socket.off('whoGetsBanana');

        hasBanana = data;
        for(let i = 0; i < gameManager.length; i++){
            gameManager[i].playerHasBanana = hasBanana;
        }
        if(socket.id == hasBanana){
            timer.startTimer();
            player.gotBanana();
        } 
    });
}

function checkAllBananaInfo(p){
    if(p.id == hasBanana && p.id != socket.id){
        if(p.bananaInHand){ 
            p.player.gotBanana();
            
            opponentBanana.visable = false;
            opponentBanana.alpha = 0;
            opponentBanana.setPosition(w/9,w/9);
        }
        else{
            p.player.removeBanana();
            if(opponentBanana == undefined){
                opponentBanana.visable = true;
                opponentBanana.alpha = 1;
                opponentBanana.setPosition(p.bananaLoc.x*w, p.bananaLoc.y*w);
            }
            else{
                opponentBanana.visable = true;
                opponentBanana.alpha = 1;
                opponentBanana.setPosition(p.bananaLoc.x*w, p.bananaLoc.y*w);

                if(p.bananaAnim){
                    opponentBanana.anims.play('bananaM', true);
                }
                else{
                    opponentBanana.anims.play('banana', true);
                }
            }
        }
    }
}
function gameEnd(){
    
    socket.off('gameData');

    score.wipeScore();
    document.getElementById("joy").style.display = "none";
    document.getElementById("gameButtons").style.display = "none";
    control.input.mouse.enabled = false;
    game.destroy(true, true);
    game = null;

    var r = new Result(gameManager);
    r.makeResults();

    var results = document.getElementById("results");
    results.style.display = "block";
    
}

export{makeGame, gameEnd};