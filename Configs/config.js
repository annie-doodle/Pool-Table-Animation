var Config = {
	view: {
		width: 1000,
		height: 618,
		angle: 60,
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
	},
	surface: {
		material: new THREE.MeshPhongMaterial({ color: 0x999999 }),
		width: 360,
		depth: 180,
	},
	table: {
		material: new THREE.MeshPhongMaterial({ color: 0x111111 }),
		width: 370,
		height: 220,
		depth: 100,
		sink: -51,
	},
	ball: {
		material: new THREE.MeshPhongMaterial({ color: 0xffffff }),
		radius: 5,
		speed: 2
	},
	paddle1: {
		material: new THREE.MeshPhongMaterial({ color: 0xffffff }),
		width: 10,
		height: 50,
		depth: 10, 
		reactiveness: 2
	},
	paddle2: {
		material: new THREE.MeshPhongMaterial({ color: 0xff4d4d }),
		width: 10,
		height: 50,
		depth: 10, 
		sensitivity: 2,
		maxSpeed: 3
	},
	ambientLight: {
		color: 0x66b3ff,
		intensity: 0.5
	},
	pointLight: {
		color: 0xffffff,
		x: 0,
		y: 0,
		z: 120,
		intensity: 1,
	}
}