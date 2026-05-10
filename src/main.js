"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  
    },
    width: 800,
    height: 600,
    scene: [MainMenu, GalleryShooter, EndScene, VictoryScene, Tutorial, Credits]
}


const game = new Phaser.Game(config);