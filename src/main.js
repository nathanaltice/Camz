// Nathan Altice
// Created: 5/4/23
// Example demonstrating cameras that use geometry masks

// take it easy, buddy
'use strict'

let config = {
    parent: "phaser-game",
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#FFDD12',
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true
        }
    },
    scene: [ MiniMap, MaskCam ]
}

const game = new Phaser.Game(config)

let { width, height } = game.config
let centerX = width / 2
let centerY = height / 2

let cursors
let keyW, keyA, keyS, keyD, keyC