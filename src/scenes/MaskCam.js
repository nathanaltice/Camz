class MaskCam extends Phaser.Scene {

    constructor() {
        super({ key: 'maskCamScene' })
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
        this.add.image(0, 0, 'gradientbg').setOrigin(0)

        // setup graphics to define camera masks
        // circle first...
        const graphicsA = this.make.graphics()
        graphicsA.fillStyle(0xFFFFFF)
        graphicsA.fillCircle(100, 100, 100)
        const circleMask = graphicsA.createGeometryMask()
        // ...then the triangle
        const graphicsB = this.make.graphics()
        graphicsB.clear()
        graphicsB.fillStyle(0xFFFFFF)
        graphicsB.fillTriangle(0, height, width, 0, width, height)
        const triMask = graphicsB.createGeometryMask()

        // set up player objects
        this.VEHICLE_VEL = 600
        this.car = this.physics.add.sprite(1500, 1500, 'car')
        this.copter = this.physics.add.sprite(500, 500, 'copter')

        this.cross = this.add.image(this.car.x, this.car.y, 'cross').setScale(5)
        this.square = this.add.image(this.copter.x, this.copter.y, 'square').setScale(5)

        // set up cameras
        this.cameras.main.setBounds(0, 0, 3000, 3000)
        this.cameras.main.startFollow(this.copter, false, 0.4, 0.4, -100)
        this.cameras.main.ignore([this.cross, this.square])

        this.sliceCamera = this.cameras.add(0, 0, width, height).setBounds(0, 0, 3000, 3000).setZoom(0.5)
        this.sliceCamera.startFollow(this.car, false, 0.4, 0.4, 200)
        this.sliceCamera.setMask(triMask)
        this.sliceCamera.ignore([this.cross, this.square])

        this.miniMapCamera = this.cameras.add(0, 0, 200, 200).setBounds(0, 0, 3000, 3000).setZoom(0.1)
        this.miniMapCamera.startFollow(this.car, false, 0.4, 0.4)
        this.miniMapCamera.setMask(circleMask)
        this.miniMapCamera.ignore([this.car, this.copter])

        // set up keyboard input
        cursors = this.input.keyboard.createCursorKeys()
        keyW = this.input.keyboard.addKey('W')
        keyA = this.input.keyboard.addKey('A')
        keyS = this.input.keyboard.addKey('S')
        keyD = this.input.keyboard.addKey('D')

        // mouse-based scene switcher
        this.input.on('pointerdown', function() {
            this.scene.start('miniMapScene')
        }, this) 
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
    }
}