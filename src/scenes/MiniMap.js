class MiniMap extends Phaser.Scene {

    constructor() {
        super({ key: 'miniMapScene' })
    }

    init() {
        this.VEHICLE_VEL = 600
    }

    preload() {
        this.load.path = 'assets/'
        this.load.image('car', 'car.png')
        this.load.image('copter', 'copter.png')
        this.load.image('cross', 'whitecross.png')
        this.load.image('square', 'square.png')
        this.load.image('gradientbg', 'gradientbg.png')
    }

    create() {
        // add background
        this.bg = this.add.image(0, 0, 'gradientbg').setOrigin(0)

        // create player objects
        this.car = this.physics.add.sprite(1500, 1500, 'car')
        this.car.body.setCollideWorldBounds(true)

        this.copter = this.physics.add.sprite(500, 500, 'copter')
        this.copter.body.setCollideWorldBounds(true)

        // create object markers
        this.cross = this.add.image(this.car.x, this.car.y, 'cross').setScale(5)
        this.square = this.add.image(this.copter.x, this.copter.y, 'square').setScale(5)

        // set up cameras
        this.cameras.main.setBounds(0, 0, 3000, 3000).setZoom(0.75)
        this.cameras.main.startFollow(this.copter, false, 0.4, 0.4)
        this.cameras.main.ignore([this.cross, this.square])

        this.miniMapCamera = this.cameras.add(32, 32, width / 5, height / 5).setBounds(0, 0, 3000, 3000).setZoom(0.1)
        this.miniMapCamera.setBackgroundColor(0x000)
        this.miniMapCamera.startFollow(this.copter, false, 0.4, 0.4)
        this.miniMapCamera.ignore([this.car, this.copter, this.bg])

        // set physics world bounds (so collideWorldBounds works properly)
        this.physics.world.bounds.setTo(0, 0, 3000, 3000)

        // set up keyboard input
        cursors = this.input.keyboard.createCursorKeys()
        keyW = this.input.keyboard.addKey('W')
        keyA = this.input.keyboard.addKey('A')
        keyS = this.input.keyboard.addKey('S')
        keyD = this.input.keyboard.addKey('D')

        // mouse-based scene switcher
        this.input.on('pointerdown', function() {
            this.scene.start('maskCamScene')
        }, this) 

        // used to check whether object is in view
        this.findableObjects = [ this.car ]
    }

    update() {
        // car movement
        this.carDirection = new Phaser.Math.Vector2()
        if(cursors.up.isDown) {
            this.carDirection.y = -1
        } else if(cursors.down.isDown) {
            this.carDirection.y = 1
        }
        if(cursors.left.isDown) {
            this.carDirection.x = -1
            this.car.setFlipX(true)
        } else if(cursors.right.isDown) {
            this.carDirection.x = 1
            this.car.setFlipX(false)
        }
        this.carDirection.normalize()
        this.car.setVelocity(this.VEHICLE_VEL * this.carDirection.x, this.VEHICLE_VEL * this.carDirection.y)
        this.cross.setPosition(this.car.x, this.car.y)

        // copter movement
        this.copterDirection = new Phaser.Math.Vector2()
        if(keyW.isDown) {
            this.copterDirection.y = -1
        } else if(keyS.isDown) {
            this.copterDirection.y = 1
        }
        if(keyA.isDown) {
            this.copterDirection.x = -1
            this.copter.setFlipX(true)
        } else if(keyD.isDown) {
            this.copterDirection.x = 1
            this.copter.setFlipX(false)
        }
        this.copterDirection.normalize()
        this.copter.setVelocity(this.VEHICLE_VEL * this.copterDirection.x, this.VEHICLE_VEL * this.copterDirection.y)
        this.square.setPosition(this.copter.x, this.copter.y)

        // check whether findable object is in view
        // (currently not wired to any logic, just proof of concept)
        let objectInView = this.cameras.main.cull(this.findableObjects)
        if (objectInView.length > 0) {
            console.log('in view')
        }
    }
}