// const { Phaser } = require("../../lib/phaser");

class MainMenu extends Phaser.Scene {
    constructor() { super("MainMenu"); }
    create() {
        this.add.text(50, 100, 
            "GALACTIC GALLERY SHOOTER \n\n Press R to Start \n\n Press T for Tutorial", { 
            fontFamily: 'Times, serif',
            fontSize: '48px' 
        });
        this.input.keyboard.on('keydown-R', () => {
            this.scene.start("GalleryShooter"); 
        });
        this.input.keyboard.on('keydown-T', () => {
            this.scene.start("Tutorial"); 
        });
               
    }
}


class EndScene extends Phaser.Scene {
    constructor() { super("EndScene"); }
    create(data) {
        const finalScore = data.Score;
        const highScore = data.HighScore;
        const HsText= highScore <= finalScore ? ` NEW PERSONAL HIGH SCORE ` : ``
        this.add.text(50, 50, 
            `GAME OVER\n${HsText}\n\nFinal Score:${finalScore}\nHigh Score: ${highScore}\n\nPress R to Retry\nPress M for Menu\nPress C for Credits`, { 
            fontFamily: 'Times, serif',
            fontSize: '48px',
            align: 'center'
        });
        this.input.keyboard.on('keydown-R', () => {
            this.scene.start("GalleryShooter"); 
        });
        this.input.keyboard.on('keydown-M', () => {
            this.scene.start("MainMenu"); 
        });
        this.input.keyboard.on('keydown-C', () => {
            this.scene.start("Credits"); 
        });
               
    }
}

class VictoryScene extends Phaser.Scene {
    constructor() { super("VictoryScene"); }
    create(data) {
        const finalScore = data.Score;
        const highScore = data.HighScore;
        this.add.text(100, 100, 
            `Victory!\n\nFinal Score: ${finalScore}\nHigh Score: ${highScore}\n\nPress R to Replay\nPress M for Menu\nPress C for Credits`, { 
            fontFamily: 'Times, serif',
            fontSize: '48px',
            align: 'center'
        });
        this.input.keyboard.on('keydown-R', () => {
            this.scene.start("GalleryShooter"); 
        });
        this.input.keyboard.on('keydown-M', () => {
            this.scene.start("MainMenu"); 
        });
        this.input.keyboard.on('keydown-C', () => {
            this.scene.start("Credits"); 
        });
               
    }
}

class Credits extends Phaser.Scene {
    constructor() { super("Credits"); }
    create() {
        this.add.text(50, 100, 
            `Code written by Aarohan Khadka \nSprite assets from : Kenny Game assets \nBackground from : \nhttps://kidagash.itch.io/galaxy-background \nSound assets from : Mojang Studios \n\nPress R to Replay\nPress M for Menu`, { 
            fontFamily: 'Times, serif',
            fontSize: '32px',
            align: 'center'
        });
        
        this.input.keyboard.on('keydown-R', () => {
            this.scene.start("GalleryShooter"); 
        });
        this.input.keyboard.on('keydown-M', () => {
            this.scene.start("MainMenu"); 
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
        
        this.load.image("enemy1", "spaceShips_001.png");
        this.load.image("enemy2", "spaceShips_005.png");
        this.load.image("enemy3", "spaceShips_006.png");
        this.load.image("enemy4", "spaceRockets_001.png");
        this.load.image("enemy0", "spaceStation_021.png");
        this.load.image("enemy02", "spaceStation_021-2.png");


        this.load.image("eBullet1", "spaceMissiles_037.png");
        this.load.image("eBullet2", "spaceMissiles_006.png");
        this.load.image("eBullet3", "spaceMissiles_015.png");
        this.load.image("eBullet4", "spaceMissiles_012.png");
        this.load.image("eBullet0", "spaceMissiles_036.png");



        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        this.load.image("stars", "starfield.png");

        
        this.load.audio("target_sfx","Targetding.mp3");

    }

    create() {
        this.input.keyboard.on('keydown-M', () => {
            this.scene.start("MainMenu"); 
        });

        this.input.keyboard.on('keydown-T', () => {
            this.scene.start("Tutorial"); 
        });

        this.input.keyboard.on('keydown-R', () => {
            this.scene.start("GalleryShooter"); 
        });

        this.input.keyboard.on('keydown-L', () => {
            this.health = -1; 
        });

        this.nextSpawnTime = 0;

        this.stars = this.add.tileSprite(0, 0, game.config.width, game.config.height, "stars").setOrigin(0, 0);
        this.stars.setTilePosition(1000 - (game.config.width/2), 0);
        this.stars.setDepth(-1);

        let my = this.my;

        this.targetDing = this.sound.add("target_sfx",{
            volume: 0.1
        });

        my.sprite.player = this.add.sprite(game.config.width/2, game.config.height - 40, "player");
        my.sprite.player.setScale(0.25);
        
        this.my.sprite.bullets = [];   
        this.my.sprite.enemyList = [];
        this.my.sprite.eBullets = [];
        this.maxBullets = 3;           
        this.myScore = 0;
        this.health = 100; 
        this.level = 1;
        this.status = true;
        
        this.waves = [this.createWave1, this.createWave2, this.createWave3, this.createWave4, this.createWave5];

        const enemyData = {
        type1a: [1, 1, 25, 25000, 400, .3, 1, 5, 10, 170, .4],
        type1b: [1, 3, 25, 25000, 400, .3, 1, 5, 10, 170, .4],
        type1c: [1, 2, 25, 25000, 400, .3, 1, 5, 10, 170, .4],
        type2a: [2, 1, 50, 45000, 2500, .5, 3, 10, 20, 70, .8],
        type2b: [2, 2, 50, 45000, 2500, .5, 3, 10, 20, 70, .8],
        type3:  [3, 1, 25, 15000, 2000, .4, 2, 3, 7, 400, .25],
        type4:  [4, 1, 100, 65000, 4000, .7, 7, 20, 7, 40, 1.2]
        };

        this.enemyWeight = [
        ...Array(3).fill(enemyData.type1a), 
        enemyData.type1b,
        enemyData.type1c,
        enemyData.type2a,
        enemyData.type2b,
        enemyData.type3,
        enemyData.type4
        ].map(args => () => this.createEnemy(...args));
        

        this.input.keyboard.on('keydown-C', () => {
            for (let enemyStat of this.my.sprite.enemyList){
                let enemy = enemyStat[0];
                enemy.active = false;  
                enemy.visible = false;
                enemy.stopFollow();
            }
            for (let ebStat of this.my.sprite.eBullets){
                let eb = ebStat[0];
                eb.destroy();
                
            }
            for (let bullet of this.my.sprite.bullets){
                bullet.destroy();
                
            }
            this.my.sprite.bullets = [];   
            this.my.sprite.enemyList = [];
            this.my.sprite.eBullets = [];
            
        });

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


        this.playerSpeed = 700;
        this.bulletSpeed = 1000;


        document.getElementById('description').innerHTML = '<h2>Gallery Shooter</h2>A: Left | D: Right <br><br> Space: Shoot <br><br>  M: Menu <br><br>  T: Tutorial <br><br> C: Skip level <br><br> R: Restart <br><br> L: Forfeit';


        my.text.score = this.add.bitmapText(530, 0, "rocketSquare", "Score " + this.myScore);

        my.text.highScore = this.add.bitmapText(429, 20, "rocketSquare", "High Score " + this.highScore);

        
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
        this.points.push(730);
        this.points.push(900);



        
        this.curve = new Phaser.Curves.Spline(this.points);

        

        let graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffffff, 1); 
        // this.curve.draw(graphics);

        this.time.addEvent({
            delay: 450, 
            callback: () => {
                if (this.my.sprite.enemyList.length > 0) {
                    const shooterStat = Phaser.Utils.Array.GetRandom(this.my.sprite.enemyList);
                    let shooter = shooterStat[0];
                    if (shooter && shooter.visible) {
                        let eb = this.add.sprite(shooter.x, shooter.y, `eBullet${shooterStat[7]}`);
                        eb.flipY = true;
                        this.my.sprite.eBullets.push([eb, shooterStat[5], shooterStat[6], shooterStat[3]]);
                    }
                }
            },
            loop: true 
        });

        
    }

    update(time, delta) {
        let my = this.my;
        let dt = delta / 1000;


        this.stars.tilePositionY += .5;

        if (this.status){
            if (this.level <= 5) {
                this.waves[this.level - 1].call(this); 
                this.status = false; 
            } else {
                this.scene.start("VictoryScene", {
                    Score: this.myScore,
                    HighScore: this.highScore
                });
            }
            
        }

        this.status = false;    
        
        this.incrementWave();

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
        
        
        for (let enemyStat of my.sprite.enemyList) {
            let enemy = enemyStat[0];
            if (enemy){
                if (enemy.active && enemy.y > 600) {
                    this.add.sprite(enemy.x, enemy.y, "whitePuff03").setScale(0.25).play("puff");
                    
                    enemy.x = -100; 
                    enemy.active = false;  
                    enemy.visible = false;
                    enemy.stopFollow();
                    
                    this.health -= enemyStat[4];
                    this.updateScore();
                    console.log("Enemy reached end, health reduced.");
                }
            }
        }
           

        for (let bullet of my.sprite.bullets) {
            for (let enemyStat of my.sprite.enemyList) {
                let enemy = enemyStat[0];
                    if (enemy){
                    if (enemy.visible && this.collides(enemy, bullet)) {
                        this.targetDing.play();
                        console.log(enemyStat[2]);
                        bullet.y = -100; 
                        bullet.active = false; 
                        bullet.visible = false;
                        enemyStat[2]--;
                        console.log(enemyStat[2]);

                        if (enemyStat[2] <= 0){
                            this.puff = this.add.sprite(enemy.x, enemy.y, "whitePuff03").setScale(enemyStat[1]).play("puff");
                            
                            enemy.x = -100; 
                            
                            enemy.active = false;  
                            enemy.visible = false;
                            
                            if (enemyStat[7]){
                                enemy.stopFollow();
                            }

                            this.myScore += enemy.scorePoints;
                            this.updateScore();
                        }
                    }
                    }

            }
        }

        this.my.sprite.eBullets = this.my.sprite.eBullets.filter((ebStat) => {
            let eb = ebStat[0];
            eb.y += ebStat[1] * dt;

            if (this.collides(this.my.sprite.player, eb)) {
                this.health -= ebStat[3];   
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
        
        for (let ebulletStat of my.sprite.eBullets) {
            let ebullet = ebulletStat[0];
            // console.log(ebulletStat);
            ebullet.y +=  ebulletStat[1] * dt;
            ebullet.setScale(ebulletStat[2]);
        }

        my.sprite.bullets = my.sprite.bullets.filter((bullet) => {
            if (bullet.y < 0 || !bullet.active) {
                bullet.destroy(); 
                return false;     
            }
            return true;
        });

        my.sprite.enemyList = my.sprite.enemyList.filter((enemyStat) => {
            let enemy = enemyStat[0];
            if (enemy){
                if (!enemy.active) {
                    enemy.destroy(); 
                    return false;    
                }
            }
            return true;
        });

        my.sprite.eBullets = my.sprite.eBullets.filter((ebulletStat) => {
            let ebullet = ebulletStat[0];
            if (!ebullet.active) {
                ebullet.destroy(); 
                return false;    
            }
            return true;
        });


        // console.log(my.sprite.enemyList.length);
        
        my.text.level.setText("Level " + this.level);

        if (this.health <= 0){
            this.scene.start("EndScene",{
                Score: this.myScore,
                HighScore: this.highScore
            }); 
        }

        if (this.level == 5 && this.boss && this.my.sprite.player) {
            if (this.boss.active){
                this.boss.x = Phaser.Math.Linear(
                    this.boss.x, 
                    this.my.sprite.player.x, 
                    0.02 
                );
                
                this.boss.y = 100 + Math.sin(this.time.now / 500) * 20;

                if (!this.bossPhase2 && my.sprite.enemyList.length > 0 && my.sprite.enemyList[0][2] <= 50) {
                    this.boss.setTexture("enemy02");
                    this.bossPhase2 = true;
                    console.log("Boss Phase 2 Started!");
                }

                let spawnDelay = this.bossPhase2 ? 800 : 1800; 
                
                if (time > this.nextSpawnTime) {
                    const spawnFunc = Phaser.Utils.Array.GetRandom(this.enemyWeight);
                    spawnFunc();
                    this.nextSpawnTime = time + spawnDelay; 
                }
            }
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
        
        my.text.health.setText("Health " + this.health);
    }

    incrementWave(){
        let my = this.my;
        if (!my.sprite.enemyList.length){
            this.level++;
            this.status = true;
        }

    }


    createEnemy(type, count, points, duration, delay, size, hp, ebDmg, exDmg, ebSpd, ebSZ){
        let my = this.my;
        for (let x = 0; x < count; x++) {
            let newEnemy = this.add.follower(this.curve, 70, 140, `enemy${type}`);
            newEnemy.setScale(size);
            newEnemy.scorePoints = points;
            newEnemy.visible = false;
            if (this.curve && this.curve.points) {
                newEnemy.startFollow({
                    delay: x * delay,
                    duration: duration,
                    repeat: 0, 
                    rotateToPath: true,
                    rotationOffset: 90,
                    delay: x * delay,
                    onStart: () => {
                        newEnemy.visible = true;
                    }
                });
            }
            my.sprite.enemyList.push([newEnemy, size, hp, ebDmg, exDmg, ebSpd, ebSZ, type]);
 
            
            
        }
    }

    createBoss(points, size, hp, ebDmg, ebSpd, ebSZ) {
        let my = this.my;
        this.boss = this.add.sprite(400, -50, 'enemy0'); 
        this.boss.setScale(size);
        this.boss.hp = hp;
        this.boss.scorePoints = points;
        
        this.tweens.add({
            targets: this.boss,
            y: 100,
            duration: 2000,
            ease: 'Power2'
        });

        my.sprite.enemyList.push([this.boss, size, hp, ebDmg, 100, ebSpd, ebSZ, 0]);
    }

    createWave1(){
        console.log("1 out")
        
        this.createEnemy(1, 10, 25, 35000, 200, .3, 1, 5, 10, 170, .4);
    }

    createWave2(){
        
        console.log("2 out")
        
        
        this.createEnemy(1, 5, 25, 30000, 300, .3, 1, 5, 10, 170, .4);
        
        this.createEnemy(2, 3, 50, 50000, 600, .5, 3, 10, 20, 70, .8);
        
    
    }

    
    createWave3(){
        
        console.log("3 out")
        
        
        this.createEnemy(1, 6, 25, 25000, 400, .3, 1, 5, 10, 170, .4);
        
        this.createEnemy(2, 2, 50, 45000, 2000, .5, 3, 10, 20, 70, .8);
        
        this.createEnemy(3, 3, 25, 15000, 800, .4, 2, 3, 7, 400, .25);
    
    }

    createWave4(){
        console.log("4 out")
        let my = this.my;
        
        this.createEnemy(1, 3, 25, 25000, 400, .3, 1, 5, 10, 170, .4);
        
        this.createEnemy(2, 2, 50, 45000, 2500, .5, 3, 10, 20, 70, .8);
        
        this.createEnemy(3, 3, 25, 15000, 2000, .4, 2, 3, 7, 400, .25);

        this.createEnemy(4, 2, 100, 65000, 4000, .7, 7, 20, 7, 40, 1.2);

        
        
    }

    
    createWave5(){
        console.log("5 out")
        
        this.createBoss(10000, 1, 100, 5, 40, 1);

    }



    
}
         


class Tutorial extends Phaser.Scene {
    constructor() { 
        super("Tutorial"); 
        this.my = {sprite: {}, text: {}};

        this.my.sprite.bullet = [];   
        this.maxBullets = 10;          
        this.myScore = 0;       
        
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


        this.load.audio("target_sfx","Targetding.mp3");


    }
    
    create() {
        
        
        this.targetDing = this.sound.add("target_sfx",{
            volume: 0.1
        });

        this.add.text(100, 5, 
            " Tutorial\n Press A strafe left\n Press D to strafe right\n Press SPACE to shoot\n Press R to Start\n Press M for Menu ", { 
            fontFamily: 'Times, serif',
            fontSize: '32px' 
        });
        this.input.keyboard.on('keydown-R', () => {
            this.scene.start("GalleryShooter"); 
        });
        this.input.keyboard.on('keydown-M', () => {
            this.scene.start("MainMenu"); 
        });

        let my = this.my;

        my.sprite.player = this.add.sprite(game.config.width/2, game.config.height - 40, "player");
        my.sprite.player.setScale(0.25);

        my.sprite.enemy1 = this.add.sprite(game.config.width/2, 150, "enemy1");
        my.sprite.enemy1.setScale(0.25);
        my.sprite.enemy1.scorePoints = 25;

        if (!this.anims.exists("puff")){
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
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.playerSpeed = 600;
        this.bulletSpeed = 1000;


        my.text.score = this.add.bitmapText(580, 0, "rocketSquare", "Score " + this.myScore);

    


   
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

            if (my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2), "bullet")
                );
            }
        }


        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));

        for (let bullet of my.sprite.bullet) {
            if (this.collides(my.sprite.enemy1, bullet)) {
                this.targetDing.play();
                this.puff = this.add.sprite(my.sprite.enemy1.x, my.sprite.enemy1.y, "whitePuff03").setScale(0.25).play("puff");

                bullet.y = -100;
                my.sprite.enemy1.visible = false;
                my.sprite.enemy1.x = -100;

                this.myScore += my.sprite.enemy1.scorePoints;
                this.updateScore();

                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.enemy1.visible = true;
                    this.my.sprite.enemy1.x = Math.random()*config.width;
                    this.my.sprite.enemy1.y = 150;
                }, this);

            }
        }

        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed * dt;
            bullet.setScale(0.2);
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
    }
}