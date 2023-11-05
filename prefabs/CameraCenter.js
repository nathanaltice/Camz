// class slightly edited from the original by Caetano Hyams (May 2019)

class CameraCenter extends Phaser.GameObjects.Sprite {
    // followObjects expects an array of objects with x/y properties
    constructor(scene, followObjects) {
        // call sprite constructor
        super(scene, 0, 0)
        this.setPosition(0, 0)

        this.followObjects = followObjects      // bind the array for later use (below)
        this.total = this.followObjects.length  // store total number of objects

        scene.add.existing(this)

        scene.cameras.main.startFollow(this, false, 0.8, 0.8)   // set camera to follow
    }

    // sets the position of 'this' to be the average (center) position of all objects in followObjects
	preUpdate (time, delta) {
		// Credit to Frentos: https://math.stackexchange.com/questions/1599095/how-to-find-the-equidistant-middle-point-for-3-points-on-an-arbitrary-polygon

		let newX = 0
		let newY = 0

		for (let i = 0; i < this.total; i++){
			newX += this.followObjects[i].x
			newY += this.followObjects[i].y
		}

		// This is where the magic happens
		this.setPosition(newX / this.total, newY / this.total)
	}
}