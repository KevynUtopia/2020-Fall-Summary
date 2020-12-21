// The point and size class used in this program
function Point(x, y) {
    this.x = (x)? parseFloat(x) : 0.0;
    this.y = (y)? parseFloat(y) : 0.0;
}

function Size(w, h) {
    this.w = (w)? parseFloat(w) : 0.0;
    this.h = (h)? parseFloat(h) : 0.0;
}

// Helper function for checking intersection between two rectangles
function intersect(pos1, size1, pos2, size2) {
    return (pos1.x < pos2.x + size2.w && pos1.x + size1.w > pos2.x &&
            pos1.y < pos2.y + size2.h && pos1.y + size1.h > pos2.y);
}


// The player class used in this program
function Player() {
    this.node = document.getElementById("player");
    this.position = PLAYER_INIT_POS;
    this.motion = motionType.NONE;
    this.verticalSpeed = 0;
}


Player.prototype.isOnPlatform = function() {
    var platforms = document.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect" && node.nodeName != "line") continue;
        if(node.nodeName == "rect"){
            var x = parseFloat(node.getAttribute("x"));
            var y = parseFloat(node.getAttribute("y"));
            var w = parseFloat(node.getAttribute("width"));
            var h = parseFloat(node.getAttribute("height"));
            
            if (((this.position.x + PLAYER_SIZE.w > x && this.position.x < x + w) ||
                ((this.position.x + PLAYER_SIZE.w) == x && this.motion == motionType.RIGHT) ||
                (this.position.x == (x + w) && this.motion == motionType.LEFT)) &&
                this.position.y + PLAYER_SIZE.h == y){
                    if(node.getAttribute('id') == "vertical")
                        onVertical = 1;
                        // setTimeout(function(){
                        //     onVertical = 0;
                        // }, 25);
                    return true;
                }
        }
        else if(node.nodeName == "line"){
            var x1 = parseFloat(node.getAttribute("x1"));
            var x2 = parseFloat(node.getAttribute("x2"));
            var y1 = parseFloat(node.getAttribute("y1"));
            // var y2 = parseFloat(node.getAttribute("y2"));
            // var w = (x2-x1)/2;

            if (((this.position.x + PLAYER_SIZE.w > (x1) && this.position.x < x2) ||
                ((this.position.x + PLAYER_SIZE.w) == (x1) && this.motion == motionType.RIGHT) ||
                (this.position.x == (x2) && this.motion == motionType.LEFT)) &&
                this.position.y + PLAYER_SIZE.h == (y1-10)){
                    // If stand on this plateform, delete it
                    disappear(node);
                    return true;
                } 
        }
    }
    if (this.position.y + PLAYER_SIZE.h == SCREEN_SIZE.h) return true;

    return false;
}

Player.prototype.collidePlatform = function(position) {
    var platforms = document.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect" && node.nodeName != "line") continue;

        if(node.nodeName == "rect"){
            var x = parseFloat(node.getAttribute("x"));
            var y = parseFloat(node.getAttribute("y"));
            var w = parseFloat(node.getAttribute("width"));
            var h = parseFloat(node.getAttribute("height"));
            var pos = new Point(x, y);
            var size = new Size(w, h);

            if (intersect(position, PLAYER_SIZE, pos, size)) {
                position.x = this.position.x;
                if (intersect(position, PLAYER_SIZE, pos, size)) {
                    if (this.position.y >= y + h)
                        position.y = y + h;
                    else
                        position.y = y - PLAYER_SIZE.h;
                    this.verticalSpeed = 0;
                }
            }
        }
        else if(node.nodeName == "line"){
            var x1 = parseFloat(node.getAttribute("x1"));
            var x2 = parseFloat(node.getAttribute("x2"));
            var y1 = parseFloat(node.getAttribute("y1"));
            var y = y1-10.0;
            var w = x2-x1;
            var h = 20.0;
            var pos = new Point(x1, y);
            var size = new Size(w, h);

            if (intersect(position, PLAYER_SIZE, pos, size)) {
                position.x = this.position.x;
                if (intersect(position, PLAYER_SIZE, pos, size)) {
                    if (this.position.y >= y + h)
                        position.y = y + h;
                    else
                        position.y = y - PLAYER_SIZE.h;
                    this.verticalSpeed = 0;
                }
            }
        }
    }
}

Player.prototype.collideScreen = function(position) {
    if (position.x < 0) position.x = 0;
    if (position.x + PLAYER_SIZE.w > SCREEN_SIZE.w) position.x = SCREEN_SIZE.w - PLAYER_SIZE.w;
    if (position.y < 0) {
        position.y = 0;
        this.verticalSpeed = 0;
    }
    if (position.y + PLAYER_SIZE.h > SCREEN_SIZE.h) {
        position.y = SCREEN_SIZE.h - PLAYER_SIZE.h;
        this.verticalSpeed = 0;
    }
}


//
// Below are constants used in the game
//
var PLAYER_SIZE = new Size(40, 40);         // The size of the player
var SCREEN_SIZE = new Size(600, 560);       // The size of the game screen
var PLAYER_INIT_POS  = new Point(0, 0);     // The initial position of the player

var MOVE_DISPLACEMENT = 5;                  // The speed of the player in motion
var JUMP_SPEED = 15;                        // The speed of the player jumping
var VERTICAL_DISPLACEMENT = 1;              // The displacement of vertical speed

var GAME_INTERVAL = 25;                     // The time interval of running the game
var BULLET_SIZE = new Size(10, 10);         // The speed of a bullet
var BULLET_SPEED = 10.0;                    // The speed of a bullet
                                            //  = pixels it moves each game loop
var SHOOT_INTERVAL = 200.0;                 // The period when shooting is disabled
var canShoot = true;                        // A flag indicating whether the player can shoot a bullet
var monsterShoot = true;                    // Monster's shooting 

var MONSTER_SIZE = new Size(40, 40);        // The speed of a bullet
var score = 0;
var PERIOD = 60000;                         // Period of each epoch of game
var MONSTER_SPEED = 2.0;                    // The speed of a monster
var THINGS_SIZE = new Size(40, 40);         // The size of a good things
var PLATFORM_SPEED = 1.00;                  // The speed of vertical platform
var COUNTINGPERIOD = 1000;                  // Counting period 
var TRANSMISSION_SIZE = new Size(40, 40);   // The size of a good things
var BGM_INTERVAL = 30000;
var DOOR_SIZE = new Size(40, 40);
var DEFAULT_NAME = "Anonymous";
var st = ("Anonymous").length;


//
// Variables in the game
//
var motionType = {NONE:0, LEFT:1, RIGHT:2}; // Motion enum\
var direction = motionType.LEFT;           //direction of player

var player = null;                          // The player object
var gameInterval = null;                    // The interval
var zoom = 1.0;                             // The zoom level of the screen
var player_name = null;                     // The name of player
var cheat_mode = 0;                         // Cheat mode off by default
var NumMonster = 6;                         // Initially create 6 monsters
var NumGoodThings = 8;                      // Number of good things
var collected = 0;                          // Count the number of collected good things
var up = 0;                                 // indicator that whether platform is going up
var timer = null;                           // A timer
var count = 60;                              // Count seconds for timer
var onVertical = 0;                         // Check if on the vertical platform 0:false, 1:true
var bulletNum = 8;                          // Initial num of bullets
var level = 1;                              // Initial level of game
var bgm = null;                             // Background music
var exit = null;                            // Exiting door music
var pdie = null;                            // player die music
var mdie = null;                             // monster die music
var pshoot = null;
var BGMInterval = null;                     // The interval for BGM
var tempBullet = 0;                         // Num opf bullets before player use cheat mode
var monsterCanShoot = 1;                    // A special monster can shoot
// var allClear = 0;                           // whether everything removed



function hide(){
    // document.getElementById("startPage").style.display = "none";
    document.getElementById("startPage").style.setProperty("visibility", "hidden", null);
    // document.getElementById("Time").style.display = "inline";
    // document.getElementById("Score").style.display = "inline";
    // document.getElementById("Level").style.display = "inline";
    needName();
}

function needName(){
    player_name = prompt("Please enter your name", DEFAULT_NAME);
    load();
}


// Should be executed after the page is loaded
function load() {
    document.getElementById("level").firstChild.data = level;
    document.getElementById("highscoretable").style.setProperty("visibility", "hidden", null);
   
    //load music
    
    exit = document.getElementById('Exit');                          
    pdie = document.getElementById('DiePlayer');                     
    mdie = document.getElementById('DieMonster');                    
    pshoot = document.getElementById('GunPlayer');   

    //trigger the timer
    count = 60;
    // timer = setInterval("countTime()", COUNTINGPERIOD);
    countTime();
    // countScore();
    // Attach keyboard events
    document.addEventListener("keydown", keydown, false);
    document.addEventListener("keyup", keyup, false);

    // Create the player
    player = new Player();
    
    
    if(player_name==null || player_name==" "||(player_name.match(/^[ ]*$/)))
        player_name = "Anonymous";
    playBGM();
    BGMInterval = setInterval("playBGM()", BGM_INTERVAL);

    
    var newText = document.createElementNS("http://www.w3.org/2000/svg","text");
    var l = player_name.length;
    
    newText.setAttributeNS(null,"font-size","10");
    newText.setAttributeNS(null,"transform","translate("+((st-l))+", 0)");
    newText.setAttributeNS(null,"id","temp_name");

    var textNode = document.createTextNode(player_name);
    newText.appendChild(textNode);
    var pre = document.getElementById("player").lastChild.firstChild;
    if(pre)
        pre.nodeValue = " ";
    document.getElementById("player").appendChild(newText);
    
    
    
    generateMonsters(NumMonster);
    generateGoodThins(NumGoodThings);

    createDoor(10, 420);
    createTransmission (4, 155);
    createTransmission (210, 470);
    
    // Start the game interval
    gameInterval = setInterval("gamePlay()", GAME_INTERVAL);
}

//
//when player died, call this
function die(){
    removeAll();
    cheat_mode = 0;



    // clearHighScoreTable();
    var highScoreTable = getHighScoreTable();
    
    // // Create the new score record
    var record = new ScoreRecord(player_name, score);
    
    // // Insert the new score record
    var position = 0;
    
    while (position < highScoreTable.length) {
        var curPositionScore = highScoreTable[position].score;
        if (curPositionScore < score)
            break;

        position++;
    }
    if (position < 5)
        highScoreTable.splice(position, 0, record);
    
    // Store the new high score table
    setHighScoreTable(highScoreTable);

    // Show the high score table
    showHighScoreTable(highScoreTable);
    
    // var node = document.getElementById('highscoretext');
    // if(position < 5){
    //     document.write("yes")
    //     node.childNodes.item(position *2).setAttribute("fill", red)
    // }

    return;
}

//
//when player go to next level success, call this
function success() {
    refresh();
    level +=1;
    NumMonster += 4;
    
    load();

}

function refresh(){
    removeAll();

    //re-initialize all variables
    //player = null;                          // The player object
    gameInterval = null;                    // The interval
    zoom = 1.0;                             // The zoom level of the screen
    //player_name = null;                     // The name of player
    //cheat_mode = 0;                         // Cheat mode off by default
    //NumMonster = 6;                         // Initially create 6 monsters
    //NumGoodThings = 8;                      // Number of good things
    collected = 0;                          // Count the number of collected good things
    up = 0;                                 // indicator that whether platform is going up
    timer = null;                           // A timer
    count = 60;                              // Count seconds for timer
    onVertical = 0;                         // Check if on the vertical platform 0:false, 1:true
    bulletNum = 8;                          // Initial num of bullets
    //level = 1;                              // Initial level of game
    bgm = null;                             // Background music
    exit = null;                            // Exiting door music
    pdie = null;                            // player die music
    mdie = null;                             // monster die music
    pshoot = null;
    BGMInterval = null;                     // The interval for BGM
    // tempBullet = 0;                         // Num opf bullets before player use cheat mode
    monsterCanShoot = 1;
    //score = 0;

}


function playBGM(){
    bgm = document.getElementById('bgm');
    bgm.play();
}

// Count time in each epoch
function countTime() {
    timer = setInterval(function() {
        count--;
        document.getElementById("countTime").firstChild.data = count;
        
        // document.getElementById('countTime').innerHTML = count;
    }, 1000)

}

//
// This function updates the position and motion of the player in the system
//
function gamePlay() {
    if(count<=0){
        clearInterval(timer);
        pdie.play();
        document.getElementById("countTime").firstChild.data = 0;
        die();
    }

    // Check collisions
    collisionDetection();
    if(onVertical)
        console.log("yes")
    // Check whether the player is on a platform
    onVertical = 0
    var isOnPlatform = player.isOnPlatform();
    
    // Update player position
    var displacement = new Point();


    // Move left or right
    if (player.motion == motionType.LEFT)
        displacement.x = -MOVE_DISPLACEMENT;
    if (player.motion == motionType.RIGHT)
        displacement.x = MOVE_DISPLACEMENT;

    // Fall
    if ((!isOnPlatform) && player.verticalSpeed <= 0 &&!onVertical) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
    }

    // Jump
    if (player.verticalSpeed > 0 || onVertical) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
        if (player.verticalSpeed <= 0)
            player.verticalSpeed = 0;
    }

    // Get the new position of the player
    var position = new Point();
    position.x = player.position.x + displacement.x;
    position.y = player.position.y + displacement.y;

    // Check collision with platforms and screen
    player.collidePlatform(position);
    player.collideScreen(position);

    // Set the location back to the player object (before update the screen)
    player.position = position;
    

    moveMonster();
    // Move the bullets
    

    
    monstersShoot();
    moveMonsterBullets();
    
    moveBullets();
    movePlatform();

    updateScreen();

 
}


function createDoor(x, y) {
    var door = document.createElementNS("http://www.w3.org/2000/svg", "use");
    door.setAttribute("x", x);
    door.setAttribute("y", y);
    door.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#door");
    document.getElementById("doors").appendChild(door);
}

function createTransmission(x, y) {
    var transmission = document.createElementNS("http://www.w3.org/2000/svg", "use");
    transmission.setAttribute("x", x);
    transmission.setAttribute("y", y);
    transmission.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#transmission");
    document.getElementById("transmissions").appendChild(transmission);
}

function generateGoodThins(Num){
    while(Num>0){
        var x_mons = Math.floor(Math.random()*SCREEN_SIZE.w-40);
        var y_mons = Math.floor(Math.random()*SCREEN_SIZE.h-40);
        if(x_mons<100 && y_mons<100)
            continue;
        if(x_mons<0 || y_mons<0)
            continue;
        if(y_mons<50)
            continue;
        if(x_mons<180 && y_mons>400 && y_mons<480)
            continue;
        if(x_mons>490)
            continue;
        position = new Point(x_mons, y_mons);
        var successful = 1;
        var platforms = document.getElementById("platforms");
        for (var i = 0; i < platforms.childNodes.length; i++) {
            var node = platforms.childNodes.item(i);
            if (node.nodeName != "rect" && node.nodeName != "line") continue;
            if(node.nodeName == "rect"){
                var x = parseFloat(node.getAttribute("x"));
                var y = parseFloat(node.getAttribute("y"));
                var w = parseFloat(node.getAttribute("width"));
                var h = parseFloat(node.getAttribute("height"));
                var pos = new Point(x, y);
                var size = new Size(w, h);

                if (intersect(position, THINGS_SIZE, pos, size)){
                    successful = 0;
                    break;
                }
            }
            else if(node.nodeName == "line"){
                var x1 = parseFloat(node.getAttribute("x1"));
                var x2 = parseFloat(node.getAttribute("x2"));
                var y1 = parseFloat(node.getAttribute("y1"));
                var y = y1-10.0;
                var w = x2-x1;
                var h = 20.0;
                var pos = new Point(x1, y);
                var size = new Size(w, h);

                if (intersect(position, THINGS_SIZE, pos, size)) {
                    successful = 0;
                    break;
                }
            }
        }
        if(successful){
            createGoodThings(x_mons, y_mons);
            Num = Num-1;
        }
    }
}

function createGoodThings(x, y) {
    var goodthing = document.createElementNS("http://www.w3.org/2000/svg", "use");
    goodthing.setAttribute("x", x);
    goodthing.setAttribute("y", y);
    goodthing.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#goodthing");
    document.getElementById("goodthings").appendChild(goodthing);
}

function generateMonsters(Num){
    while(Num>0){
        var x_mons = Math.floor(Math.random()*SCREEN_SIZE.w-40);
        var y_mons = Math.floor(Math.random()*SCREEN_SIZE.h-40);
        if(x_mons<100 && y_mons<100)
            continue;
        if(x_mons>440 && y_mons>350)
            continue;
        if(x_mons<0 || y_mons<0)
            continue;
        if(y_mons<50)
            continue;
        if(x_mons<180 && y_mons>400 && y_mons<480)
            continue;
        position = new Point(x_mons, y_mons);
        var successful = 1;
        var platforms = document.getElementById("platforms");
        for (var i = 0; i < platforms.childNodes.length; i++) {
            var node = platforms.childNodes.item(i);
            if (node.nodeName != "rect" && node.nodeName != "line") continue;

            if(node.nodeName == "rect"){
                var x = parseFloat(node.getAttribute("x"));
                var y = parseFloat(node.getAttribute("y"));
                var w = parseFloat(node.getAttribute("width"));
                var h = parseFloat(node.getAttribute("height"));
                var pos = new Point(x, y);
                var size = new Size(w, h);

                if (intersect(position, MONSTER_SIZE, pos, size)){
                    successful = 0;
                    break;
                }
            }
            else if(node.nodeName == "line"){
                var x1 = parseFloat(node.getAttribute("x1"));
                var x2 = parseFloat(node.getAttribute("x2"));
                var y1 = parseFloat(node.getAttribute("y1"));
                var y = y1-10.0;
                var w = x2-x1;
                var h = 20.0;
                var pos = new Point(x1, y);
                var size = new Size(w, h);

                if (intersect(position, MONSTER_SIZE, pos, size)) {
                    successful = 0;
                    break;
                }
            }
        }
        if(successful){
            createMonster(x_mons, y_mons);
            Num = Num-1;
        }
    }
}

function createMonster(x, y) {
    var monster = document.createElementNS("http://www.w3.org/2000/svg", "use");
    monster.setAttribute("x", x);
    monster.setAttribute("y", y);
    monster.setAttribute("head", motionType.LEFT);
    monster.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monster");
    
    if((x+y)%2)
        monster.setAttribute("dir", motionType.RIGHT);
    else
        monster.setAttribute("dir", motionType.LEFT);
    document.getElementById("monsters").appendChild(monster);
}


function moveMonster() {
    // go through all monsters
    var monsters = document.getElementById("monsters");
    for (var i = 0; i < monsters.childNodes.length; i++) {
        var node = monsters.childNodes.item(i);
        var d = node.getAttribute('dir');//current direction of motion of the monster
        var head = node.getAttribute('head');//the direction that the monster is facing to
        // Current position of the monster
        var x = parseInt(node.getAttribute("x"));
        var y = parseInt(node.getAttribute("y"));
        var position = new Point(x, y);
        // var next_d = motionType.NONE;
        // if(d != head){
        //     if(d == motionType.LEFT){
        //         node.setAttribute("transform", "scale(1, 1)");
        //         var matrix = "matrix(-1, 0, 0, 1, 40, 0)";
        //         // node.setAttribute("transform", matrix);
        //         node.setAttribute("transform", "translate(40,0) scale(-1, 1)");
        //     }
        //     else{
        //         var matrix = "matrix(1, 0, 0, 1, 0, 0)";
        //         // node.setAttribute("transform", matrix);
        //         node.setAttribute("transform", "scale(1, 1)");
        //         node.setAttribute("transform", "translate(40,0) scale(-1, 1)");
        //     }
        // }

        
        if(d == motionType.RIGHT){
            // x+=
            node.setAttribute("x", x +MONSTER_SPEED);
            
        }
        if(d == motionType.LEFT){
            // x-=MONSTER_SPEED
            node.setAttribute("x", x - MONSTER_SPEED); 
            
        }
        if(checkColl(position)){
            if (d==motionType.LEFT) {
                node.setAttribute('dir', motionType.RIGHT);
                node.setAttribute("x", x + MONSTER_SPEED);               
            }
            else {
                node.setAttribute('dir', motionType.LEFT);
                node.setAttribute("x", x - MONSTER_SPEED);          
            }
            // monsterFlip(node);
        }
        
        if (x >= SCREEN_SIZE.w-40) {
            node.setAttribute('dir', motionType.LEFT);
            node.setAttribute("x", x - MONSTER_SPEED);
            // monsterFlip(node);
        }
        if(x <= 0) {
            node.setAttribute('dir', motionType.RIGHT);
            node.setAttribute("x", x + MONSTER_SPEED);
            // monsterFlip(node);   
        }
        
        //d = node.getAttribute('dir'); //get updated motion direction again
        x = parseInt(node.getAttribute("x"));//updated position
        y = parseInt(node.getAttribute("y"));
        //if heading at opposite direction of motion, flip it
        // if(d!=head){
            
            // node.setAttribute("transform", "translate("+(2*MONSTER_SIZE.w+SCREEN_SIZE.w/2)+",0) scale(-1, 1)");
        //     head = d;

        // }

        
    }
}



function moveBullets() {
    // Go through all bullets
    var bullets = document.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var node = bullets.childNodes.item(i);
        
        var d = node.getAttribute('dire');
        // Update the position of the bullet
        var x = parseInt(node.getAttribute("x"));
        if(d==motionType.RIGHT)
            node.setAttribute("x", x + BULLET_SPEED);
        if(d==motionType.LEFT)
            node.setAttribute("x", x - BULLET_SPEED);
        // If the bullet is not inside the screen delete it from the group
        if (x > SCREEN_SIZE.w || x < 0) {
            bullets.removeChild(node);
            i--;
        }
    }
}

function moveMonsterBullets() {
    var monsters = document.getElementById("monsters");
    var node = monsters.childNodes.item(0);
    // Go through all bullets
    var bullets = document.getElementById("monsterbullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var node = bullets.childNodes.item(i);
        
        var d = node.getAttribute('dire');
        // Update the position of the bullet
        var x = parseInt(node.getAttribute("x"));
        if(d==motionType.RIGHT)
            node.setAttribute("x", x + BULLET_SPEED);
        if(d==motionType.LEFT)
            node.setAttribute("x", x - BULLET_SPEED);
        // If the bullet is not inside the screen delete it from the group
        if (x > SCREEN_SIZE.w || x < 0) {
            bullets.removeChild(node);
            i--;
        }
    }
}

function movePlatform() {
    var obj = document.getElementById('vertical');
    var y_temp = parseInt(obj.getAttribute('y'));
    if(y_temp<450 && !up)
        y_temp += PLATFORM_SPEED;
    if(y_temp>380 && up)
        y_temp -= PLATFORM_SPEED;
    if(y_temp>=450 && !up)
        up = 1;
    if(y_temp<=380 && up)
        up = 0;
    obj.setAttribute('y', y_temp);
    // document.write(document.getElementById('vertical').getAttribute('y'));
}

//
//monster's shooting
function monstersShoot(){
    var bullets = document.getElementById("monsterbullets");
    var node = bullets.childNodes.item(0);
    if(node==null && monsterCanShoot){
        var monsters = document.getElementById("monsters");
        var node = monsters.childNodes.item(0);
        if(node != null){
            var x = parseInt(node.getAttribute("x"));
            var y = parseInt(node.getAttribute("y"));
            var dh = node.getAttribute('dir');
            // Create the bullet using the use node
            var bullet = document.createElementNS("http://www.w3.org/2000/svg", "use");
            bullet.setAttribute("x", x + MONSTER_SIZE.w / 2 - BULLET_SIZE.w / 2);
            bullet.setAttribute("y", y + MONSTER_SIZE.h / 2 - BULLET_SIZE.h / 2);
            bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monsterbullet");
            bullet.setAttribute("dire",dh);
            document.getElementById("monsterbullets").appendChild(bullet);
        }
    }
 
}

function shootBullet() {
    // Disable shooting for a short period of time
    canShoot = false;
    setTimeout("canShoot = true", SHOOT_INTERVAL);
    
    
    // Create the bullet using the use node
    if(bulletNum>0){                
        var bullet = document.createElementNS("http://www.w3.org/2000/svg", "use");
        bullet.setAttribute("x", player.position.x + PLAYER_SIZE.w / 2 - BULLET_SIZE.w / 2);
        bullet.setAttribute("y", player.position.y + PLAYER_SIZE.h / 2 - BULLET_SIZE.h / 2);
        bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#bullet");
        bullet.setAttribute("dire",direction);
        document.getElementById("bullets").appendChild(bullet);
        bulletNum--;
        if(bulletNum>100)
            document.getElementById("bull").firstChild.data = "INF";
        else
            document.getElementById("bull").firstChild.data = bulletNum;
        pshoot.pause();
        pshoot.play();
    }
}

//delete the disappearing platform
function disappear(node) {
    // var grad = setInterval(deletePlatform(node),50);
    var platforms = document.getElementById('platforms')
    var platformOpacity = parseFloat(node.style.getPropertyValue("opacity"));
    platformOpacity -= 0.1;
    node.style.setProperty("opacity", platformOpacity, null);
    if(platformOpacity<=0)
        platforms.removeChild(node);
}



//
// This is the keydown handling function for the SVG document
//
function keydown(evt) {
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "A".charCodeAt(0):
            // if(onVertical){
            //     player.verticalSpeed = 0;
            //     player.verticalSpeed = motionType.NONE;
            // }
            player.motion = motionType.LEFT;
            break;

        case "D".charCodeAt(0):
            // if(onVertical){
            //     player.verticalSpeed = 0;
            //     player.verticalSpeed = motionType.NONE;
            // }
            player.motion = motionType.RIGHT;
            break;
			

        // Add your code here
		
			
        case "W".charCodeAt(0):
            // if(onVertical){
            //     player.verticalSpeed = 0;
            //     player.verticalSpeed = motionType.NONE;
            // }
            if (player.isOnPlatform()||onVertical) {
                player.verticalSpeed = JUMP_SPEED;
            }
            break;

        case "H".charCodeAt(0):
            if (canShoot) shootBullet();
            break;

        case "C".charCodeAt(0)://cheat mode on
            if(!cheat_mode)
                tempBullet = bulletNum;
            bulletNum = 999999999;
            cheat_mode = 1;
            document.getElementById("cheatM").firstChild.data = "ON";
            document.getElementById("bull").firstChild.data = "INF";
        
        break;

        case "V".charCodeAt(0)://exit cheat mode
            if(cheat_mode)
                bulletNum= tempBullet;
            cheat_mode = 0;
            document.getElementById("cheatM").firstChild.data = "OFF";
            document.getElementById("bull").firstChild.data = bulletNum;
        
        break;

        case "R".charCodeAt(0)://reset high score table
            clearHighScoreTable();
    
    break;
    }
}

//
// This is the keyup handling function for the SVG document
//
function keyup(evt) {
    // Get the key code
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "A".charCodeAt(0):
            if (player.motion == motionType.LEFT) player.motion = motionType.NONE;
            break;

        case "D".charCodeAt(0):
            if (player.motion == motionType.RIGHT) player.motion = motionType.NONE;
            break;
    }
}

function collisionDetection() {
    // Check whether the player collides with a monster
    
    var monsters = document.getElementById("monsters");
    for (var i = 0; i < monsters.childNodes.length; i++) {
        var monster = monsters.childNodes.item(i);
        var x = parseInt(monster.getAttribute("x"));
        var y = parseInt(monster.getAttribute("y"));

        if ( intersect(new Point(x, y), MONSTER_SIZE, player.position, PLAYER_SIZE)) {
            if(y>=player.position.y+30 && player.verticalSpeed<0){
                mdie.play();
                monsters.removeChild(monster);
                i--;
            }
            else if(!cheat_mode){
                pdie.play();
                // Clear the game interval
                die();
                return;
            }
        }
    }

    // Check whether the player collides with a goodthins
    var goodthings = document.getElementById("goodthings");
    for (var i = 0; i < goodthings.childNodes.length; i++) {
        var goodthing = goodthings.childNodes.item(i);
        var x = parseInt(goodthing.getAttribute("x"));
        var y = parseInt(goodthing.getAttribute("y"));

        if (intersect(new Point(x, y), THINGS_SIZE, player.position, PLAYER_SIZE)) {
            // goodthing.style.display = "none";
            score += 5; //5 points for each goodthing
            document.getElementById("score").firstChild.data = score;
            goodthings.removeChild(goodthing);
            collected += 1;
        }
    }
    
    // Check whether a bullet hits a monster
    var bullets = document.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var bullet = bullets.childNodes.item(i);
        var x = parseInt(bullet.getAttribute("x"));
        var y = parseInt(bullet.getAttribute("y"));

        for (var j = 0; j < monsters.childNodes.length; j++) {
            var monster = monsters.childNodes.item(j);
            var mx = parseInt(monster.getAttribute("x"));
            var my = parseInt(monster.getAttribute("y"));

            if (intersect(new Point(x, y), BULLET_SIZE, new Point(mx, my), MONSTER_SIZE)) {
                if(j==0)
                    monsterCanShoot=0;
                mdie.play();
                monsters.removeChild(monster);

                j--;
                bullets.removeChild(bullet);
                i--;
                //write some code to update the score
                score += 10;
                document.getElementById("score").firstChild.data = score;
            }
        }
    }

    // Check whether a bullet hits player
    var monsterbullets = document.getElementById("monsterbullets");
    for (var i = 0; i < monsterbullets.childNodes.length; i++) {
        var monsterbullet = monsterbullets.childNodes.item(i);
        var x = parseInt(monsterbullet.getAttribute("x"));
        var y = parseInt(monsterbullet.getAttribute("y"));
        if (!cheat_mode && intersect(new Point(x, y), BULLET_SIZE, player.position, PLAYER_SIZE)) {
            pdie.play();
            die();
            return;
        }
    
    }


    // Check whether the player collides with a transmissions
    var transmissions = document.getElementById("transmissions");
    var transmission1 = transmissions.childNodes.item(0);
    var transmission2 = transmissions.childNodes.item(1);
   
    var x1 = parseInt(transmission1.getAttribute("x"));
    var y1 = parseInt(transmission1.getAttribute("y"));
    var x2 = parseInt(transmission2.getAttribute("x"));
    var y2 = parseInt(transmission2.getAttribute("y")); 
    
    var p1 = new Point(x1, y1);
    var p2 = new Point(x2, y2);
    if (intersect(p1, TRANSMISSION_SIZE, player.position, PLAYER_SIZE)) {
        // document.write("yes");
        // var x = x2 - 20;
        // var y = y2;
        player.node.setAttribute("transform", "scale(1, 1)");
        player.position.x = x2 - 50;
        player.position.y = y2;
        player.node.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")");
        
    }
    if (intersect(p2, TRANSMISSION_SIZE, player.position, PLAYER_SIZE)) {
        player.node.setAttribute("transform", "scale(1, 1)");
        player.position.x = x1 + 40;
        player.position.y = y1 - 20;
        player.node.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")");
        
    }


    // Check whether the player collides with Exit Door
    var doors = document.getElementById("doors");
    var door = doors.childNodes.item(0);
    
    var x = parseInt(door.getAttribute("x"));
    var y = parseInt(door.getAttribute("y"));
    
    if (intersect(new Point(x, y), DOOR_SIZE, player.position, PLAYER_SIZE) && (collected >= NumGoodThings)) {
        score += level*100;
        score += count;
        document.getElementById("score").firstChild.data = score;
        exit.play();
        success();
        return;
    }
}

//
//helper function to check collision with platform for nonplayers
function checkColl(position){
    if(position.x>=500 && position.y>380)
        return true;
    var platforms = document.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect" && node.nodeName != "line") continue;

        if(node.nodeName == "rect"){
        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var pos = new Point(x, y);
        var size = new Size(w, h);
        if (intersect(position, PLAYER_SIZE, pos, size))
            return true;
        }   
        else if(node.nodeName == "line"){
            var x1 = parseFloat(node.getAttribute("x1"));
            var x2 = parseFloat(node.getAttribute("x2"));
            var y1 = parseFloat(node.getAttribute("y1"));
            var y = y1-10.0;
            var w = x2-x1;
            var h = 20.0;
            var pos = new Point(x1, y);
            var size = new Size(w, h);

            if (intersect(position, PLAYER_SIZE, pos, size)) {
                return true;
            }
        }
    }
    return false;
}

//
// This function updates the position of the player's SVG object and
// set the appropriate translation of the game screen relative to the
// the position of the player
//
function flip(obj){
    if(player.motion == motionType.LEFT && direction == motionType.RIGHT){
        obj.setAttribute("transform", "translate("+PLAYER_SIZE.w+",0) scale(-1, 1)");
        obj.setAttribute("transform", "scale(1, 1)");
        direction = motionType.LEFT;
    }
    else if(player.motion == motionType.RIGHT && direction == motionType.LEFT){
        obj.setAttribute("transform", "translate("+PLAYER_SIZE.w+",0) scale(-1, 1)");
        direction = motionType.RIGHT;
    }
}

function updateScreen() {
    // Transform the player
    player.node.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")");
    // Calculate the scaling and translation factors	
    
    // Add your code here
    var obj = document.getElementById('svg_part')
    flip(obj);

}

function restart(){
    DEFAULT_NAME = player_name;
    refresh();

    level = 1;
    score = 0;
    document.getElementById("countTime").firstChild.data = count;
    document.getElementById("level").firstChild.data = level;
    if(cheat_mode)
        document.getElementById("cheatM").firstChild.data = "ON";
    else   
        document.getElementById("cheatM").firstChild.data = "OFF";
    document.getElementById("bull").firstChild.data = bulletNum;
    document.getElementById("score").firstChild.data = score;
    needName();
}

//
// remove all goodthings monsters bullets player on the screen
function removeAll() {

    clearInterval(gameInterval);
    clearInterval(timer);
    clearInterval(BGMInterval);

    var monsters = document.getElementById("monsters");
    while(monsters.childNodes.item(0)){
        for (var i = 0; i < monsters.childNodes.length; i++) {
            var node = monsters.childNodes.item(i);
            monsters.removeChild(node);
        }
    }
    
    var bullets = document.getElementById("bullets");
    while(bullets.childNodes.item(0)){
        for (var i = 0; i < bullets.childNodes.length; i++) {
            var node = bullets.childNodes.item(i);
            bullets.removeChild(node);
        }
    }
    var goodthings = document.getElementById("goodthings");
    while(goodthings.childNodes.item(0)){
        for (var i = 0; i < goodthings.childNodes.length; i++) {
            var node = goodthings.childNodes.item(i);
            goodthings.removeChild(node);
        }
    }
    var monsterbullets = document.getElementById("monsterbullets");
    while(monsterbullets.childNodes.item(0)){
        for (var i = 0; i < monsterbullets.childNodes.length; i++) {
            var node = monsterbullets.childNodes.item(i);
            monsterbullets.removeChild(node);
        }
    }
    var highscoretext = document.getElementById("highscoretext");
    // while(player.childNodes.item(0)){
    while(highscoretext.childNodes.item(0)) {
        for (var i = 0; i < highscoretext.childNodes.length; i++) {
                var node = highscoretext.childNodes.item(i);
                highscoretext.removeChild(node);
            }
    }
    // }
    var temp_name = document.getElementById("temp_name");
    temp_name.firstChild = " ";
    
    
    // for (var i = 0; i < temp_name.childNodes.length; i++) {
    //         var node = temp_name.childNodes;
    //         node.nodeValue = " ";
    //     }
    return;
}   
