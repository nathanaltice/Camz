class VariZoom extends Phaser.Scene {

    constructor() {
        super({ key: 'variZoomScene' })
    }

    preload() {
        this.load.path = 'assets/'
        this.load.image('car', 'car.png')
        this.load.image('copter', 'copter.png')
        this.load.image('gradientbg', 'gradientbg.png')
    }

    create() {
        this.bg = this.add.image(0, 0, 'gradientbg').setOrigin(0)

        this.VEHICLE_VEL = 600
        this.ZOOM_DURATION = 250
        this.MAX_ZOOM = 1.0
        this.MIN_ZOOM = 0.2675

        // create player objects
        this.car = this.physics.add.sprite(this.bg.width / 2, this.bg.height / 2, 'car')
        this.car.body.setCollideWorldBounds(true)

        this.copter = this.physics.add.sprite(this.bg.width / 2, this.bg.height / 2, 'copter')
        this.copter.body.setCollideWorldBounds(true)

        // set up cameras
        this.cameras.main.setBounds(0, 0, 3000, 3000)

        // created "center object" btwn two vehicles (for camera to follow)
        this.centerObject = new CameraCenter(this, [this.car, this.copter])

        // set physics world bounds (so collideWorldBounds works properly)
        this.physics.world.bounds.setTo(0, 0, 3000, 3000)

        // graphics object to draw line
        this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xfacade }, fillStyle: { color: 0xfacade } })

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

        // calculate camera zoom based on distance between vehicles
        let distanceBtwnObjs = Phaser.Math.Distance.BetweenPoints(this.copter, this.car)
        let maxDistance = Math.sqrt(Math.pow(this.bg.width, 2) + Math.pow(this.bg.height, 2))        

        let interpZoom = range(maxDistance / 2, 0, this.MIN_ZOOM, this.MAX_ZOOM, distanceBtwnObjs)

        this.cameras.main.setZoom(interpZoom)

        // draw debug line between vehicles
        this.graphics.clear()
        this.graphics.lineBetween(this.car.x, this.car.y, this.copter.x, this.copter.y)
    }
}

// source: https://www.trysmudford.com/blog/linear-interpolation-functions/
const lerp = (x, y, a) => x * (1 - a) + y * a
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a))
const invlerp = (x, y, a) => clamp((a - x) / (y - x))
const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a))