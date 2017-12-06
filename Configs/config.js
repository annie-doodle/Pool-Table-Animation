var Config = {
	view: {
		width: 640,
		height: 360,
		angle: 70,
		near: 0.01,
		far: 10000
	},
	camera: {
		x: -70,
		y: 0,
		z: 90,
		sensitivity: 0.02
	},
	field: {
		width: 400,
		height: 200
	},
	ground: {
		material: new THREE.MeshPhongMaterial({ color: 0xcccccc }),
		width: 1000,
		height: 1,
		depth: 1000,
		sink: -100,
		resolution: 1
	},
	plane: {
		material: new THREE.MeshPhongMaterial({ color: 0x666666 }),
		width: 350,
		height: 200,
		resolution: 5
	},
	table: {
		material: new THREE.MeshPhongMaterial({ color: 0x111111 }),
		width: 370,
		height: 220,
		depth: 100,
		sink: -51,
		resolution: 5
	},
	ball: {
		material: new THREE.MeshPhongMaterial({ color: 0xffffff }),
		radius: 5,
		segments: 6,
		ring: 5,
		speed: 2
	},
	paddle1: {
		material: new THREE.MeshPhongMaterial({ color: 0x000000 }),
		width: 10,
		height: 50,
		depth: 10, 
		resolution: 1,
		reactiveness: 2
	},
	paddle2: {
		material: new THREE.MeshPhongMaterial({ color: 0xff0000 }),
		width: 10,
		height: 50,
		depth: 10, 
		resolution: 1,
		sensitivity: 2,
		maxSpeed: 3
	},
	ambientLight: {
		color: 0x5a9ce8
	},
	pointLight: {
		color: 0x5a9ce8,
		x: -500,
		y: 0,
		z: 500,
		intensity: 2,
		distance: 5000
	},
	spotLight: {
		color: 0xbb6033,
		x: 0,
		y: 0,
		z: 500,
		intensity: 2
	}
}