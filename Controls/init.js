var scene, camera, renderer;
var ambientLight, pointLight;
var ball, paddle1, paddle2;

var initScene = function () {
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(Config.view.angle, Config.view.width / Config.view.height, Config.view.near, Config.view.far);
	
	scene.add(camera);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(Config.view.width, Config.view.height);

	var container = document.getElementById('container');
	container.appendChild(renderer.domElement);

	initGround();
	initTable();
	initBall();
	initPaddels();

	initAmbientLight();
	initPointLight();
}
var initGround = function () {
	var groundGeometry = new THREE.CubeGeometry(Config.ground.width, Config.ground.depth, Config.ground.height);
	var ground = new THREE.Mesh(groundGeometry, Config.ground.material);

	ground.position.z = Config.ground.sink;
	
	ground.receiveShadow = true;	
	
	scene.add(ground);
}
var initTable = function () {
	var tableGeometry = new THREE.CubeGeometry(Config.table.width, Config.table.height, Config.table.depth);
	var table = new THREE.Mesh(tableGeometry, Config.table.material);
	
	table.position.z = Config.table.sink;
	
	table.castShadow = true;	
	table.receiveShadow = true;	
	
	scene.add(table);

	var surfaceGeometry = new THREE.PlaneGeometry(Config.surface.width, Config.surface.depth);
	var surface = new THREE.Mesh(surfaceGeometry, Config.surface.material);
	
	surface.castShadow = true;	
	surface.receiveShadow = true;	

	scene.add(surface);
}
var initBall = function () {
	var ballGeometry = new THREE.SphereGeometry(Config.ball.radius);
	ball = new THREE.Mesh(ballGeometry, Config.ball.material);

	ball.position.x = 0;
	ball.position.y = 0;
	ball.position.z = Config.ball.radius;

	ball.velocity = new THREE.Vector3(1, 1, 0);

	ball.receiveShadow = true;
    ball.castShadow = true;
	
	scene.add(ball);
}
var initPaddels = function () {
	var paddle1Geometry = new THREE.CubeGeometry(Config.paddle1.width, Config.paddle1.height, Config.paddle1.depth);
	paddle1 = new THREE.Mesh(paddle1Geometry, Config.paddle1.material);

	paddle1.position.x = -Config.field.width / 2 + Config.paddle1.width;
	paddle1.position.z = Config.paddle1.depth;

	paddle1.velocity = new THREE.Vector3(0, 0, 0);

	paddle1.receiveShadow = true;
    paddle1.castShadow = true;

	scene.add(paddle1);
	
	var paddle2Geometry = new THREE.CubeGeometry(Config.paddle2.width, Config.paddle2.height, Config.paddle2.depth);
	paddle2 = new THREE.Mesh(paddle2Geometry, Config.paddle2.material);
	  
    paddle2.position.x = Config.field.width / 2 - Config.paddle2.width;
	paddle2.position.z = Config.paddle2.depth;

	paddle2.velocity = new THREE.Vector3(0, 0, 0);
	
	paddle2.receiveShadow = true;
    paddle2.castShadow = true;	

    scene.add(paddle2);
}
var initAmbientLight = function () {
	ambientLight = new THREE.AmbientLight(Config.ambientLight.color);

	ambientLight.intensity = Config.ambientLight.intensity;
	
	scene.add(ambientLight);
}
var initPointLight = function () {
	pointLight = new THREE.PointLight(Config.pointLight.color);

	pointLight.position.x = ball.position.x + Config.pointLight.x;
	pointLight.position.y = ball.position.y + Config.pointLight.y;
	pointLight.position.z = ball.position.z + Config.pointLight.z;

	pointLight.intensity = Config.pointLight.intensity;

    pointLight.castShadow = true;
	
	scene.add(pointLight);
}

var initControl = function () {
	window.addEventListener('keydown', function (event) {
		_keyCode = event.keyCode;
	})
	window.addEventListener('keyup', function (event) {
		_keyCode = null;
	})
}