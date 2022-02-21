class Game {
    constructor(){

        this.reset = createButton("Reset");
    }

    getState(){
        var gameStateRef = database.ref('gameState');
        gameStateRef.on("value",function(data){
            gameState = data.val();
        })
    }

    update(state){
        database.ref('/').update({
            gameState: state
        });
    }

    async start(){
        if(gameState === 0){
            player = new Player();
            var playerCountRef = await database.ref('playerCount').once("value");
            if(playerCountRef.exists()){
                playerCount = playerCountRef.val();
                player.getCount();
            }
            
            form = new Form();
            form.display();
        }
        plane1 = createSprite(width/2-300,height-200);
        plane1.addImage("plane1", plane1Img);

        plane2 = createSprite(width/2-100,height-200);
        plane2.addImage("plane2", plane2Img);

        plane3 = createSprite(width/2+100,height-200);
        plane3.addImage("plane3", plane3Img);

        plane4 = createSprite(width/2+300,height-200);
        plane4.addImage("plane4", plane4Img);

        planes = [plane1, plane2, plane3, plane4];

        obstacleGroup = new Group();

        var obstacleposition = [
            {x:width/2+250, y:height-800,image: obImage},
            {x:width/2-150, y:height-1300,image : obImage},
            {x:width/2+250, y:height-1800,image: obImage },
            {x:width/2-180, y:height-2300,image: obImage },
            {x:width/2, y:height-2800,image: obImage },
            {x:width/2-180, y:height-3300,image: obImage },
            {x:width/2+180, y:height-3300,image: obImage },
            {x:width/2+250, y:height-3800,image: obImage },
            {x:width/2-150, y:height-4300,image: obImage },
            {x:width/2+250, y:height-4800,image: obImage },
            {x:width/2, y:height-5300,image: obImage },
            {x:width/2-180, y:height-5500,image: obImage },
            {x:width/2-100, y:height-2500,image: obImage }
        ];

        this.addObstacles(obstacleGroup,obstacleposition.length,obImage, 0.2, obstacleposition);
    }

    addObstacles(obGroup,oblength,obImage,scale,positions = []){
        
            //start writing
            for (var i = 0; i < oblength; i++) {
                var x, y;
          
                //C41 //SA
                if (positions.length > 0) {
                  x = positions[i].x;
                  y = positions[i].y;
                  obImage = positions[i].image;
                } else {
                  x = random(width / 2 + 150, width / 2 - 150);
                  y = random(-height * 4.5, height - 400);
                }
                var sprite = createSprite(x, y);
                sprite.addImage("sprite", obImage);
          
                sprite.scale = scale;
                obGroup.add(sprite);
              }
        
        obstacleGroup = obGroup;
    }
    play(){
        form.hide();

        this.reset.position(displayWidth-100,20);
        Player.getPlayerInfo();
        this.handleResetButton();

        if(allplayers !== undefined){
             
            background("#C68767");
            image(track,0,-displayHeight*4,displayWidth,displayHeight*5);

            var index = 0;

            var x = 175;
            var y;

            for(var plr in allplayers){
                index = index + 1;

                x = x + 200;

                y=displayHeight - allplayers[plr].distance;
                planes[index-1].x = x;
                planes[index - 1].y = y;


                if(index === player.index){
                
                    stroke(10)
                    fill("blue")
                    ellipse(x,y,60,60);
                    camera.position.x = displayWidth/2;
                    camera.position.y = planes[index-1].y


                    this.handleCollision(index);
                    
                }
            }
        }

        if(keyIsDown(UP_ARROW) && player.index !== null){
            player.distance +=10
           
            player.update();
        }

        if(player.distance>4800){
            player.rank++;
            gameState = 2;
        }

        drawSprites();
    }

    handleCollision(index){

        if(keyDown("w")){
            bullets = createSprite(planes[index-1].x, planes[index-1].y);
            bullets.addImage(bulletImage);
            bullets.scale = 0.05;
            bullets.velocityY = -10;


            // bullets.overlap(obstacleGroup, function(collector, collected) {
                           
            //     //collected is the sprite in the group collectibles that triggered
            //     //the event
            //     collected.remove();
            //     bullets.remove();
            //   });

            obstacleGroup.overlap(bullets, (obs) => {
                obs.remove();
                bullets.remove();
                player[index-1].score+=10;
                obImage.hide();
            })

            player.update();
        }



    }

    handleResetButton() {
        this.reset.mousePressed(() => {
          database.ref("/").set({
            playerCount: 0,
            gameState: 0,
            players: {}
          });
          window.location.reload();
        });
      }


    end(){
        swal({
            title:`AWESOME!${"\n"}Rank${"\n"}${player.rank}`,
            text:"YOU WON",
            imageUrl:"gameWinImage.jpg",
            imageSize:"100x100",
            confirmButtonText:"OK"
        })
    }
}