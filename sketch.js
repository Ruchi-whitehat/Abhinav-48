var plane1, plane2, plane3, plane4;
var canvas, gameState = 0 , playerCount = 0;
var database, form, player, game;
var plane1Img, plane2Img, plane3Img, plane4Img;
var planes = [];
var allplayers = [];
var track;
var bullets;
var obstacle, obstacleGroup, obGroup;

function preload(){
    plane1Img = loadImage("plain1.png");
    plane2Img = loadImage("plain2.png");
    plane3Img = loadImage("plain3.png");
    plane4Img = loadImage("plain4.png");
    track = loadImage("track.png");

    obImage = loadImage("enemy.png");
    bulletImage = loadImage("missile.png");
}

function setup(){
    database = firebase.database();
    canvas = createCanvas(displayWidth , displayHeight);

    game = new Game();
    game.getState();
    game.start();

}

function draw(){
    if(playerCount === 4){
        game.update(1);
    }
    if(gameState === 1){
        clear();
        game.play();
    }
    if(gameState === 2){
        game.end();
    }
}