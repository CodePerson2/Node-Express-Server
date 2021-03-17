import {JoystickController} from './joy.js';

function bananaDefine(game){

    let bananas = game.anims.create(
    {
        key: 'banana',
        frames: [ { key: 'banana', frame: 0 } ],
        frameRate: 20
    });

    //banana
    bananas = game.anims.create(
    {
        key: 'bananaM',
        frames: game.anims.generateFrameNumbers('banana', {start: 0, end: 3}),
        frameRate: 8,
        repeat: -1
    });
    
    bananas = game.physics.add.group(
    {
        key: 'banana',
        Mass: 0.5
    });
    
    return bananas

}

class Player 
{
    constructor(game, Phaser, bananas, scale, mouse){
        this.hasBanana = false;
        this.player;
        this.game = game;
        this.Phaser = Phaser;
        this.bananas = bananas;

        this.cursors;
        this.mouse = mouse;
        this.mouseSupport;
        this.joystick;
        this.gameButtons;
        this.jump;
        this.throw;
        this.keyA;
        this.keyD;
        this.spaceB;
        this.doubleJ = true;
        this.newJump;
        this.mouseUp = true;
        this.ban; //carried banana
        this.banana; //thrown banana
        this.bananaOffset = -10;
        this.scale = scale;
        this.direction;

    }
    gotBanana()
    {
        
        this.hasBanana = true;
        this.ban.visible = true;
    }
    has_Banana()
    {
        return this.hasBanana
    }
    bananaLoc(){
        if(this.banana == undefined) return {x: 0, y: 0};
        return {x: this.banana.x/this.scale, y: this.banana.y/this.scale};
    }
    deleteThrownBanana(){
        this.banana.disableBody(true, true);
    }
    createPlayer(loc, color)
    {
        this.player = this.game.physics.add.sprite(loc.x, loc.y, color);

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(this.scale/this.player.width * .05);
        this.player.setDepth(2);

        //  Our player animations, turning, walking left and walking right.
        this.game.anims.create({
            key: 'left',
            frames: this.game.anims.generateFrameNumbers(color, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.game.anims.create({
            key: 'turn',
            frames: [ { key: color, frame: 4 } ],
            frameRate: 20
        });

        this.game.anims.create({
            key: 'right',
            frames: this.game.anims.generateFrameNumbers(color, { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.ban = this.bananas.create(this.player.x, this.player.y, 'banana'); //carried nana
        this.ban.body.enable = false;
        this.ban.setScale(this.scale/this.ban.width * 0.05);
        this.ban.setDepth(4);
        if(!this.hasBanana){
            this.removeBanana();
        }

        if (matchMedia('(pointer:fine)').matches) { //check for mouse support
            this.mouseSupport = true;
        }
        else{
            this.mouseSupport = false;
            document.getElementById("joy").style.display = "block";
            document.getElementById("gameButtons").style.display = "block";
        }
    }

    createInput()
    {

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.joystick = new JoystickController("stick", 64, 8);
        
        this.keyA = this.game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceB = this.game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    buttonThrow(){
        this.throw = true;
    }
    buttonJump(){
        this.jump = true;
    }

    move()
    {
        if (this.cursors.left.isDown || this.keyA.isDown || this.joystick.value.x < -.1)
        {
            this.player.setVelocityX(-this.scale*0.4);
            this.bananaOffset = -this.scale*0.015;
            this.player.anims.play('left', true);
            this.direction = -1;
        }
        else if (this.cursors.right.isDown || this.keyD.isDown || this.joystick.value.x > .1)
        {
            this.player.setVelocityX(this.scale*0.4);
            this.bananaOffset = this.scale*0.035;
            this.player.anims.play('right', true);
            this.direction = 1;
        }
        else
        {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
            this.direction = 0;
        }
        if(this.player.body.touching.down && this.doubleJ){
            this.doubleJ = false;
        }

        if (this.player.body.touching.down && (this.spaceB.isDown || this.jump))
        {
            this.jump = false
            this.player.setVelocityY(-this.scale*0.6);
            this.newJump = false;
        }
        else if ((this.doubleJ == false) && (this.newJump) && (this.spaceB.isDown || this.jump))
        {
            this.jump = false;
            this.player.setVelocityY(-this.scale*0.6);
            this.doubleJ = true;
        }
        else if(!this.player.body.touching.down && this.jump){
            this.jump = false;
        }

        if(this.spaceB.isUp && !this.newJump){
            this.newJump = true;
        }
        
        if((this.mouse.isDown && this.mouseUp) || this.throw){
            this.throw = false;
            this.throwBanana();
            this.mouseUp = false;
        }
        if(this.mouse.justUp){
            this.mouseUp = true;
        }
        
        this.setBananaPos(this.bananaOffset);
        
    }
    setBananaPos(offset){
        this.ban.setPosition(this.player.x+offset, this.player.y + this.scale*0.02);
    }
    getDirection(){
        return this.direction;
    }
    removeBanana(){
        this.hasBanana = false;
        this.ban.disableBody(true, true);
    }
    getbananaAnim(){
        if(this.banana == undefined) return false;
        else if(this.banana.anims.currentAnim.key == 'bananaM'){
            return true;
        }
        else{
            return false;
        }
    }
    throwBanana(){
        if(!this.hasBanana) return; //one banana only

        let aim = this.mouseToPlayer();
        
        
        this.banana = this.bananas.create(this.player.x, this.player.y, 'banana');
        this.banana.setVelocity(this.scale*0.9*aim.x + this.player.body.velocity.x, this.scale*0.7*aim.y + this.player.body.velocity.y);
        this.banana.setScale(this.scale/this.ban.width * 0.05);
        this.banana.setBounceY(this.Phaser.Math.FloatBetween(0.4, 0.6));
        this.banana.setCollideWorldBounds(true);
        this.banana.anims.play('bananaM', true);
        this.removeBanana();
    }
    mouseToPlayer(){
        var x;
        var y;
        var total;
        if(this.mouseSupport){      //mouse information
            x = this.mouse.x - this.player.x;
            y = this.mouse.y - this.player.y;
            total = Math.abs(x) + Math.abs(y);
        }
        else if(!this.mouseSupport){    //joystick information
            x = this.joystick.value.x;
            y = this.joystick.value.y;
            total = Math.abs(x) + Math.abs(y);
        }
        if(total == 0)return {x: 0, y: 0};
        
        return {x: (x/total), y: (y/total)};
    }
}

class Opponent 
{
    constructor(game, Phaser, bananas, scale){
        this.hasBanana = false;
        this.player;
        this.game = game;
        this.Phaser = Phaser;
        this.bananas = bananas;
        this.scale = scale;

        this.ban; //carried banana
        this.bananaOffset = this.scale*0.035;

        this.left = "left";
        this.right = "right";
        this.turn = "turn";

        this.text;
        this.textSize = "14px Exo";


    }

    gotBanana()
    {
        this.hasBanana = true;
        this.ban.visible = true;
    }
    has_Banana()
    {
        return this.hasBanana
    }

    createPlayer(loc, color, name)
    {
        this.left += color;
        this.right += color;
        this.turn += color;

        this.player = this.game.physics.add.sprite(loc.x, loc.y, color);

        if(this.scale < 500) this.textSize = "11px Exo";
        if(this.scale > 800) this.textSize = "16px Exo";
        this.text = this.game.add.text(0, 0, name, {font: this.textSize, fill: "#ffffff"});

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(this.scale/this.player.width * .05);
        this.player.setDepth(2);

        //  Our player animations, turning, walking left and walking right.
        this.game.anims.create({
            key: this.left,
            frames: this.game.anims.generateFrameNumbers(color, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.game.anims.create({
            key: this.turn,
            frames: [ { key: color, frame: 4 } ],
            frameRate: 20
        });

        this.game.anims.create({
            key: this.right,
            frames: this.game.anims.generateFrameNumbers(color, { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.ban = this.bananas.create(this.player.x, this.player.y, 'banana'); //carried nana
        this.ban.body.enable = true;
        this.ban.setScale(this.scale/this.ban.width * 0.05);
        this.ban.setDepth(4);
        if(!this.hasBanana){
            this.removeBanana();
        }
    }


    move(loc)
    {
        //right
        if(loc.direction == 1){
            this.player.anims.play(this.right, true);
            this.bananaOffset = this.scale*0.035;
            
        }
        //left
        else if(loc.direction == -1){
            this.player.anims.play(this.left, true);
            this.bananaOffset = -this.scale*0.015;
        }
        else{
            this.player.anims.play(this.turn, true);
        }
        //update position
        this.player.setPosition(loc.x, loc.y);
        this.text.setPosition(loc.x - this.text.width/2, loc.y - (this.scale+200)*0.055);

        this.setBananaPos();

        
    }
    setBananaPos(){
        this.ban.setPosition(this.player.x+this.bananaOffset, this.player.y + this.scale*0.02);
    }
    collectBanana(banana){
        banana.disableBody(true, true);
        this.gotBanana();
    }
    removeBanana(){
        this.hasBanana = false;
        this.ban.disableBody(true, true);
    }
    throwBanana(aim){
        if(!this.hasBanana)return;

        var banana = this.bananas.create(aim.x, aim.y, 'banana');
        
        banana.setScale(this.scale/this.ban.width * 0.05);
        banana.setBounceY(this.Phaser.Math.FloatBetween(0.4, 0.6));
        banana.setCollideWorldBounds(true);
        banana.anims.play('bananaM', true);
        this.removeBanana();
    }
    
}
class Banana{
    constructor(game, Phaser, bananas, scale){
        this.game = game;
        this.Phaser = Phaser;
        this.bananas = bananas;
        this.scale = scale;

        this.banana;
    }

    setBananaPos(loc){
        this.banana.setPosition(loc.x, loc.y);
    }
    removeBanana(){
        this.banana.disableBody(true, true);
    }
    playAnim(){
        this.banana.anims.play('bananaM', true);
    }
    stopAnim(){
        this.banana.anims.stop(null, true);
    }
    makeBanana(loc){
        if(!this.hasBanana)return;

        this.banana = this.bananas.create(loc.x, loc.y, 'banana');
        
        this.banana.setScale(this.scale/this.ban.width * 0.05);
        this.banana.anims.play('bananaM', true);
        
    }
}

class Score{
    constructor(room){
        this.room = room;
        this.score = document.getElementById("score");
        this.scoreBoard = document.getElementById("scoreBoard");
    }

    makeScore(){
        this.score.style.display = "inline-block";
        
        for(let i=0; i<this.room.length; i++){
            let name = document.createElement("div");
            let score = document.createElement("div");
            let spot = document.createElement("div");

            name.classList.add("score_board_spot_entry");
            score.classList.add("score_board_spot_num");
            spot.classList.add("score_board_spot");

            score.setAttribute("id", this.room[i].socketid);

            name.innerHTML = this.room[i].name;
            score.innerHTML = "2";

            spot.append(name);
            spot.append(score);
            this.scoreBoard.append(spot);

            this.room[i]["scoreid"] = document.getElementById(this.room[i].socketid);
        }
        
    }
    updateScore(room){
        for(let i=0; i<this.room.length; i++){
            this.room[i].scoreid.innerHTML = "";
            this.room[i].scoreid.innerHTML = room[i].time;
            
        }
    }
    wipeScore(){
        this.score.style.display = "none";

        this.scoreBoard.innerHTML = "";
    }

}

class Timer{
    constructor(){
        this.time = 0;
        this.timeBegan = 0;

        this.date;
    }
    startTimer(){
        this.timeBegan = this.getCurrentTime();
    }
    endTimer(){
        this.time += (this.getCurrentTime() - this.timeBegan);
    }
    getTime(hasBanana, socketid){
        if(hasBanana == socketid){
            return (this.time + this.getCurrentTime() - this.timeBegan);
        }
        else{
            return this.time;
        }
    }
    getCurrentTime(){
        this.date = new Date();
        return this.date.getHours() * 3600 + this.date.getMinutes() * 60 + this.date.getSeconds();
    }
}

class Result{
    constructor(room){
        this.room = room;
        this.newR = [];
        this.tmpnum;
        this.tmp;
        this.storeSpot;
        this.resultsBoard = document.getElementById("resultsBoard");
    }

    orderResults(){
        for(let i=0; i<this.room.length; i++){
            this.tmp = this.room[0];
            this.tmpnum = 100;

            this.storeSpot = 0;
            for(let j=0; j<this.room.length; j++){
                if(this.room[j].time < this.tmpnum && this.room[j].hasBanana != 1){
                    this.tmp = this.room[j];
                    this.tmpnum = this.room[j].time;
                    this.storeSpot = j;
                }
            }
            let hld = this.tmp;
            this.newR.push(hld);
            this.room[this.storeSpot].hasBanana = 1;
        }
    }

    makeResults(){
        this.orderResults();

        this.resultsBoard.innerHTML = "";

        for(let i=0; i<this.room.length; i++){

            let place = document.createElement("div");
            let name = document.createElement("div");
            let score = document.createElement("div");
            let spot = document.createElement("div");

            place.classList.add("results_board_spot_place")
            name.classList.add("results_board_spot_name");
            score.classList.add("results_board_spot_score");
            spot.classList.add("results_board_spot");

            name.innerHTML = this.newR[i].name;
            score.innerHTML = this.newR[i].time;
            if(i != 0 && this.newR[i].time == this.newR[i-1].time){
                place.innerHTML = this.newR[i-1].score;
                this.newR[i].score = this.newR[i-1].score; 
            }
            else{
                place.innerHTML = i+1;
                this.newR[i].score = i+1;
            }
            

            spot.append(place);
            spot.append(name);
            spot.append(score);
            this.resultsBoard.append(spot);

        }
        
    }
}

export{bananaDefine, Player, Opponent, Banana, Score, Timer, Result};