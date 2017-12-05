var camera, scene, renderer;
var geometry, material, mesh;

// detect for webgl
if (!Detector.webgl) {
	alert('has problems');
}

// graphics variables
var container, stats;
var camera, controls, scene, renderer;
var clock = new THREE.Clock();
var clickRequest = false;
var mouseCoords = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var ballMaterial = new THREE.MeshPhongMaterial({ color: 0x202020 });
var pos = new THREE.Vector3();
var quat = new THREE.Quaternion();

// physics variables
var gravityConstant = -9.8;
var physicsWorld;
var rigidBodies = [];
var softBodies = [];
var margin = 0.05;
var transformAux1 = new Ammo.btTransform();
var softBodyHelpers = new Ammo.btSoftBodyHelpers();


var init = function () {
	initGraphics();
	initPhysics();
	createObjects();
	initInput();
}

var initGraphics = function () {
	// find container for canvas
	container = document.getElementById('container');

	// initiate camera with frustum parameters
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.2, 2000);

	// initiate scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xffffff);

	// initial position of camera
	camera.position.set(-7, 5, 8);

	// keyboard control
	controls = new THREE.OrbitControls(camera);

	// set initial focal point
	controls.target.set(0, 2, 0);
	controls.update();

	// initiate renderer and set meta parameters
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;

	// ambient light (Phong's ambient component)
	var ambientLight = new THREE.AmbientLight(0x333333);
	scene.add(ambientLight);

	// directional light (Phong's specfular and diffusive component)
	var light = new THREE.DirectionalLight(0xc0e6d6, 1);
	light.position.set(-10, 10, 5);
	light.castShadow = true;

	// add light shadow configurations
	var d = 20;
	light.shadow.camera.left = -d;
	light.shadow.camera.right = d;
	light.shadow.camera.top = d;
	light.shadow.camera.bottom = -d;

	light.shadow.camera.near = 2;
	light.shadow.camera.far = 50;

	light.shadow.mapSize.x = 1024;
	light.shadow.mapSize.y = 1024;

	// add directional light to scene
	scene.add(light);

	// append render object
	container.innerHTML = '';
	container.appendChild(renderer.domElement);
}

var initPhysics = function () {
	// collision configuration
	var collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
	var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);

	// collision detection using space partitioning
	var broadphase = new Ammo.btDbvtBroadphase();

	// bullet continuous detection
	var solver = new Ammo.btSequentialImpulseConstraintSolver();

	// deformation for soft bodies
	var softBodySolver = new Ammo.btDefaultSoftBodySolver();

	// initiate physics world representation
	physicsWorld = new Ammo.btSoftRigidDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration, softBodySolver);

	// set gravity
	physicsWorld.setGravity(new Ammo.btVector3(0, gravityConstant, 0));
	physicsWorld.getWorldInfo().set_m_gravity(new Ammo.btVector3(0, gravityConstant, 0));
}

var createObjects = function () {
	// ground position and rotation parameters
	pos.set(0, -0.5, 0);
	quat.set(0, 0, 0, 1);

	// initiate ground object
	var ground = createParalellepiped(40, 1, 40, 0, pos, quat, new THREE.MeshPhongMaterial({ color: 0xffffff}));
	ground.castShadow = true;
	ground.receiveShadow = true;

	// initiate sphere object
	var volumeMass = 15;
	var sphereGeometry = new THREE.SphereBufferGeometry(1.5, 40, 25);
	sphereGeometry.translate(5, 5, 0);
	createSoftVolume(sphereGeometry, volumeMass, 250);

	// initiate box geometry
	var boxGeometry = new THREE.BufferGeometry().fromGeometry(new THREE.BoxGeometry(1, 1, 5, 4, 4, 20));
	boxGeometry.translate(-2, 5, 0);
	createSoftVolume(boxGeometry, volumeMass, 120);

	// ramp position and rotation parameters
	pos.set(3, 1, 0);
	quat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), 30 * Math.PI / 180);

	// initiate ramp object
	var obstacle = createParalellepiped(10, 1, 4, 0, pos, quat, new THREE.MeshPhongMaterial({ color: 0x606060 }));
	obstacle.castShadow = true;
	obstacle.receiveShadow = true;
}

var initInput = function () {
	window.addEventListener('mousedown', function (event) {
		if (!clickRequest) {
			var mouseX, mouseY;
			mouseX = event.clientX / window.innerWidth * 2 - 1;
			mouseY = -event.clientY / window.innerHeight * 2 + 1;

			mouseCoords.set(mouseX, mouseY);

			clickRequest = true;
		}
	}, false);
}

var processClick = function () {
	if (clickRequest) {
		// re-casting rays from camera to pixels
		raycaster.setFromCamera(mouseCoords, camera);

		// bullet ball parameters
		var ballMass = 3;
		var ballRadius = 0.4;

		// bullet ball geometry
		var ball = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 18, 16), ballMaterial);
		ball.castShadow = true;
		ball.receiveShadow = true;

		// define margin for ball
		var ballShape = new Ammo.btSphereShape(ballRadius);
		ballShape.setMargin(margin);

		// update position and rotatin parameters
		pos.copy(raycaster.ray.direction);
		pos.add(raycaster.ray.origin);

		quat.set(0, 0, 0, 1);

		// initiate bullet ball object
		var ballBody = createRigidBody(ball, ballShape, ballMass, pos, quat);
		ballBody.setFriction(0.5);

		// update position based on current camera position and mouse coordinates
		pos.copy(raycaster.ray.direction);
		pos.multiplyScalar(14);

		// assign initial velocity of ball
		ballBody.setLinearVelocity(new Ammo.btVector3(pos.x, pos.y, pos.z));

		clickRequest = false;
	}
}

var createParalellepiped = function (sx, sy, sz, mass, pos, quat, material) {
	// pre-processing for parallelpiped objects
	var threeObject = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), material);
	var shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
	shape.setMargin(margin);

	createRigidBody(threeObject, shape, mass, pos, quat);

	return threeObject;
}

var isEqual = function (x1, y1, z1, x2, y2, z2) {
	// account for float point errors
	var delta = 0.000001;

	return Math.abs( x2 - x1 ) < delta && Math.abs( y2 - y1 ) < delta && Math.abs( z2 - z1 ) < delta;
}

var createSoftVolume = function (bufferGeom, mass, pressure) {
	processGeometry(bufferGeom);

	// create soft volume object
	var volume = new THREE.Mesh(bufferGeom, new THREE.MeshPhongMaterial({ color: 0xffffff}));
	volume.castShadow = true;
	volume.receiveShadow = true;
	volume.frustumCulled = false;
	scene.add(volume);

	var volumeSoftBody = softBodyHelpers.CreateFromTriMesh(physicsWorld.getWorldInfo(), bufferGeom.ammoVertices, bufferGeom.ammoIndices, bufferGeom.ammoIndices.length / 3, true);

	// set iteration configurations
	var sbConfig = volumeSoftBody.get_m_cfg();
	sbConfig.set_viterations(40);
	sbConfig.set_piterations(40);

	// soft-soft and soft-rigid collisions
	sbConfig.set_collisions(0x11);

	// friction
	sbConfig.set_kDF(0.1);

	// damping
	sbConfig.set_kDP(0.01);

	// pressure
	sbConfig.set_kPR(pressure);

	// stiffness
	volumeSoftBody.get_m_materials().at(0).set_m_kLST(0.9);
	volumeSoftBody.get_m_materials().at(0).set_m_kAST(0.9);

	// total mass
	volumeSoftBody.setTotalMass(mass, false);

	Ammo.castObject(volumeSoftBody, Ammo.btCollisionObject).getCollisionShape().setMargin(margin);

	physicsWorld.addSoftBody(volumeSoftBody, 1, -1);

	volume.userData.physicsBody = volumeSoftBody;

	softBodies.push(volume);
}

var processGeometry = function (bufferGeometry) {
	var geometry = new THREE.Geometry().fromBufferGeometry(bufferGeometry);
	var vertsDiff = geometry.mergeVertices();
	
	var indexedBufferGeom = createIndexedBufferGeometryFromGeometry(geometry);

	mapIndices(bufferGeometry, indexedBufferGeom);
}

var createIndexedBufferGeometryFromGeometry = function (geometry) {
	// count vertices and faces
	var numVertices = geometry.vertices.length;
	var numFaces = geometry.faces.length;

	// create buffers and arrays
	var bufferGeom = new THREE.BufferGeometry();
	var vertices = new Float32Array(numVertices * 3);
	var indices = new (numFaces * 3 > 65535 ? Uint32Array : Uint16Array)(numFaces * 3);

	// set vertices values
	for (var i = 0; i < numVertices; i ++) {
		var p = geometry.vertices[i];

		var i3 = i * 3;

		vertices[i3] = p.x;
		vertices[i3 + 1] = p.y;
		vertices[i3 + 2] = p.z;
	}

	// set face normals
	for (var i = 0; i < numFaces; i ++) {
		var f = geometry.faces[i];

		var i3 = i * 3;

		indices[i3] = f.a;
		indices[i3 + 1] = f.b;
		indices[i3 + 2] = f.c;
	}

	// fill buffer
	bufferGeom.setIndex(new THREE.BufferAttribute(indices, 1));
	bufferGeom.addAttribute('position', new THREE.BufferAttribute(vertices, 3));

	return bufferGeom;
}

var mapIndices = function (bufferGeometry, indexedBufferGeom) {
	var vertices = bufferGeometry.attributes.position.array;
	var idxVertices = indexedBufferGeom.attributes.position.array;
	var indices = indexedBufferGeom.index.array;

	var numIdxVertices = idxVertices.length / 3;
	var numVertices = vertices.length / 3;

	bufferGeometry.ammoVertices = idxVertices;
	bufferGeometry.ammoIndices = indices;
	bufferGeometry.ammoIndexAssociation = [];

	for (var i = 0; i < numIdxVertices; i ++) {
		var association = [];
		bufferGeometry.ammoIndexAssociation.push(association);

		var i3 = i * 3;

		for (var j = 0; j < numVertices; j ++) {
			var j3 = j * 3;

			if (isEqual(idxVertices[i3], idxVertices[i3 + 1], idxVertices[i3 + 2], vertices[j3], vertices[j3 + 1], vertices[j3 + 2])) {
				association.push(j3);
			}
		}
	}
}

var createRigidBody = function (threeObject, physicsShape, mass, pos, quat) {
	threeObject.position.copy(pos);
	threeObject.quaternion.copy(quat);

	// define rigid body transform function
	var transform = new Ammo.btTransform();
	transform.setIdentity();
	transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
	transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));

	var motionState = new Ammo.btDefaultMotionState(transform);

	// inertia
	var localInertia = new Ammo.btVector3(0, 0, 0);
	physicsShape.calculateLocalInertia(mass, localInertia);

	var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
	var body = new Ammo.btRigidBody(rbInfo);

	threeObject.userData.physicsBody = body;

	scene.add(threeObject);

	if (mass > 0) {
		rigidBodies.push(threeObject);
	}

	physicsWorld.addRigidBody(body);

	return body;
}

var render = function () {
	var deltaTime = clock.getDelta();

	updatePhysics(deltaTime);

	processClick();

	renderer.render(scene, camera);
}

var animate = function () {
	requestAnimationFrame(animate);

	render();
}

var updatePhysics = function (deltaTime) {
	// proceed in time accounting for physical forces
	physicsWorld.stepSimulation(deltaTime, 10);

	// update positions and normals for soft bodies
	for (var i = 0; i < softBodies.length; i ++) {
		var volume = softBodies[i];
		var geometry = volume.geometry;
		var softBody = volume.userData.physicsBody;

		var volumePositions = geometry.attributes.position.array;
		var volumeNormals = geometry.attributes.normal.array;
		var association = geometry.ammoIndexAssociation;
		var numVerts = association.length;
		var nodes = softBody.get_m_nodes();

		for (var j = 0; j < numVerts; j ++) {
			var node = nodes.at(j);

			// positions
			var nodePos = node.get_m_x();

			var x = nodePos.x();
			var y = nodePos.y();
			var z = nodePos.z();

			// normals
			var nodeNormal = node.get_m_n();

			var nx = nodeNormal.x();
			var ny = nodeNormal.y();
			var nz = nodeNormal.z();

			var assocVertex = association[j];

			for (var k = 0; k < assocVertex.length; k ++) {
				var indexVertex = assocVertex[k];
				// x
				volumePositions[indexVertex] = x;
				volumeNormals[indexVertex] = nx;
				indexVertex ++;

				// y
				volumePositions[indexVertex] = y;
				volumeNormals[indexVertex] = ny;
				indexVertex ++;			

				// z
				volumePositions[indexVertex] = z;
				volumeNormals[indexVertex] = nz;
			}
		}

		geometry.attributes.position.needsUpdate = true;
		geometry.attributes.normal.needsUpdate = true;
	}

	// update positions and normals for rigid bodies
	for (var i = 0; i < rigidBodies.length; i ++) {
		var objThree = rigidBodies[i];
		var objPhys = objThree.userData.physicsBody;
		var ms = objPhys.getMotionState();

		if (ms) {
			// read updated position and rotation values from simulation
			ms.getWorldTransform(transformAux1);

			var p = transformAux1.getOrigin();
			var q = transformAux1.getRotation();

			// overwrite position and rotation values
			objThree.position.set(p.x(), p.y(), p.z());
			objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
		}
	}
}


init();
animate();