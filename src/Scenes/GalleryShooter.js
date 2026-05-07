class MainMenu extends Phaser.Scene {
    constructor() { super("MainMenu"); }
    create() {
        this.add.text(100, 100, 
            "GALLERY SHOOTER \n Press SPACE to Start", { 
            fontFamily: 'Times, serif',
            fontSize: '32px' 
        });
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start("GalleryShooter"); 
        });
        
               
    }
}

class EndScene extends Phaser.Scene {
    constructor() { super("EndScene"); }
    create(data) {
        const finalScore = data.Score;
        const highScore = data.HighScore;
        this.add.text(100, 100, 
            `GAME OVER\n\nFinal Score: ${finalScore}\nHigh Score: ${highScore}\n\nPress SPACE to Retry`, { 
            fontFamily: 'Times, serif',
            fontSize: '32px',
            align: 'center'
        });
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start("GalleryShooter"); 
        });
               
    }
}

class GalleryShooter extends Phaser.Scene {
    graphics;
    curve;
    path;
    constructor() {
        super("GalleryShooter");

        this.my = {sprite: {}, text: {}};

        this.highScore = 0;  
        

    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("player", "spaceBuilding_024.png");
        this.load.image("bullet", "spaceParts_079.png");
        this.load.image("eBullet", "spaceMissiles_037.png");
        this.load.image("enemy1", "spaceShips_001.png");

        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

    }

    create() {
        let my = this.my;

        my.sprite.player = this.add.sprite(game.config.width/2, game.config.height - 40, "player");
        my.sprite.player.setScale(0.25);
        
        this.my.sprite.bullets = [];   
        this.my.sprite.enemyList = [];
        this.my.sprite.eBullets = [];
        this.maxBullets = 15;           
        this.myScore = 0;
        this.health = 100; 
        this.level = 1;

        // this.graphics = this.add.graphics();
        if (!this.anims.exists("puff")) {
            this.anims.create({
                key: "puff",
                frames: [
                    { key: "whitePuff00" },
                    { key: "whitePuff01" },
                    { key: "whitePuff02" },
                    { key: "whitePuff03" },
                ],
                frameRate: 20,    
                repeat: 5,
                hideOnComplete: true
            });
        }


        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.rKey = this.input.keyboard.addKey("K");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        this.playerSpeed = 450;
        this.bulletSpeed = 450;
        this.eBulletsSpeed = 200;


        document.getElementById('description').innerHTML = '<h2>Gallery Shooter</h2><br>A: left // D: right // Space: shoot';


        my.text.score = this.add.bitmapText(580, 0, "rocketSquare", "Score " + this.myScore);

        my.text.highScore = this.add.bitmapText(479, 20, "rocketSquare", "High Score " + this.highScore);

        
        my.text.level = this.add.bitmapText(10, 5, "rocketSquare", "Level " + this.level);

    
        my.text.health = this.add.bitmapText(10, 550, "rocketSquare", "Health " + this.health);




        this.add.text(10, 600, 'Health ' + this.health, {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: {
                width: 60
            }
        });

        this.points = [ 
        ];
        for (let x = 1; x < 11; x++){
            if (x % 2){
                this.points.push(70);
                this.points.push(100+x*40)
            } else{
                this.points.push(730);
                this.points.push(100+x*40)
            }
        }
        
        this.curve = new Phaser.Curves.Spline(this.points);
        this.createWave1();

        let graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffffff, 1); 
        this.curve.draw(graphics);

        this.time.addEvent({
            delay: 700, 
            callback: () => {
                if (this.my.sprite.enemyList.length > 0) {
                    const shooter = Phaser.Utils.Array.GetRandom(this.my.sprite.enemyList);
                    if (shooter && shooter.visible) {
                        let eb = this.add.sprite(shooter.x, shooter.y, "eBullet");
                        eb.setScale(0.2);
                        this.my.sprite.eBullets.push(eb);
                    }
                }
            },
            loop: true 
        });

    }

    update(time, delta) {
        let my = this.my;
        let dt = delta / 1000;

 

        if (this.left.isDown) {
            if (my.sprite.player.x > (my.sprite.player.displayWidth/2)) {
                my.sprite.player.x -= this.playerSpeed * dt;
            }
        }

        if (this.right.isDown) {
            if (my.sprite.player.x < (game.config.width - (my.sprite.player.displayWidth/2))) {
                my.sprite.player.x += this.playerSpeed * dt;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            if (my.sprite.bullets.length < this.maxBullets) {
                my.sprite.bullets.push(this.add.sprite(
                    my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2), "bullet")
                );
               
            }
        }

  
        my.sprite.bullets = my.sprite.bullets.filter((bullet) => bullet.y > -(bullet.displayHeight/2));

        for (let bullet of my.sprite.bullets) {
            for (let enemy of my.sprite.enemyList) {
                
                if (enemy.visible && this.collides(enemy, bullet)) {

                    this.puff = this.add.sprite(enemy.x, enemy.y, "whitePuff03").setScale(0.25).play("puff");
                    
                    bullet.y = -100; 
                    enemy.x = -100; 

                    bullet.active = false; 
                    bullet.visible = false;
                    enemy.active = false;  
                    enemy.visible = false;
                    enemy.stopFollow();

                    this.myScore += enemy.scorePoints;
                    this.updateScore();

                }
            }
        }

        this.my.sprite.eBullets = this.my.sprite.eBullets.filter((eb) => {
            eb.y += this.eBulletsSpeed * dt;

            if (this.collides(this.my.sprite.player, eb)) {
                this.health -= 5;
                this.updateScore(); 
                eb.destroy();
                return false;
            }

            if (eb.y > game.config.height) {
                eb.destroy();
                return false;
            }
            return true;
        });

        for (let bullet of my.sprite.bullets) {
            bullet.y -= this.bulletSpeed * dt;
            bullet.setScale(0.2);
        }
        
        for (let ebullet of my.sprite.eBullets) {
            ebullet.y += this.eBulletsSpeed * dt;
            ebullet.setScale(.5);
        }

        my.sprite.bullets = my.sprite.bullets.filter((bullet) => {
            if (bullet.y < 0 || !bullet.active) {
                bullet.destroy(); 
                return false;     
            }
            return true;
        });

        my.sprite.enemyList = my.sprite.enemyList.filter((enemy) => {
            if (!enemy.active) {
                enemy.destroy(); 
                return false;    
            }
            return true;
        });

        my.sprite.eBullets = my.sprite.eBullets.filter((ebullet) => {
            if (!ebullet.active) {
                ebullet.destroy(); 
                return false;    
            }
            return true;
        });


        // console.log(my.sprite.enemyList.length);

        if (this.health <= 0){
            this.health = 100;
            this.scene.start("EndScene",{
                Score: this.myScore,
                HighScore: this.highScore
            }); 

        }


    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
        
        if (this.myScore > this.highScore) {
            this.highScore = this.myScore;
        }
        
        my.text.highScore.setText("High Score " + this.highScore);
        
        my.text.level.setText("Level " + this.level);
        my.text.health.setText("Health " + this.health);
    }

    createWave1(){
        let my = this.my;
        for (let x = 0; x < 10; x++) {
        let newEnemy = this.add.follower(this.curve, 70, 140, "enemy1");
        newEnemy.setScale(0.3);
        newEnemy.scorePoints = 25;
        newEnemy.visible = true;
        if (this.curve && this.curve.points) {
            newEnemy.startFollow({
                duration: 25000,
                repeat: 0, 
                rotateToPath: true,
                rotationOffset: 90,
                delay: x * 200 
            });
        }
        my.sprite.enemyList.push(newEnemy);
    }
    }



    
}
         