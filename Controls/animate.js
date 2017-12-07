var _keyCode;

var animate = function () {
	animatePhysics();
	
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
var animatePhysics = function () {
	animateBall();
	
	animatePaddle1();
	animatePaddle2();
	
	animatePaddleBallInteractions();

	animateCamera();
}

var animateBall = function () {
	// space key to restart
	if (_keyCode == 32) {
		restart();
	}

	// reset if ball falls off
	if (ball.position.x <= -Config.field.width / 2 || ball.position.x >= Config.field.width / 2) {	
		reset();
	}
	
	// bounce back
	if (ball.position.y <= -Config.field.height / 2 || ball.position.y >= Config.field.height / 2) {
		ball.velocity.y = -ball.velocity.y;
	}	

	// progress in time	
	ball.position.x += ball.velocity.x * Config.ball.speed;
	ball.position.y += ball.velocity.y * Config.ball.speed;
}

var animatePaddle1 = function () {
	// move left if left key hit and motion viable
	if (_keyCode == 37) {
		if (paddle1.position.y < Config.field.height / 2 - Config.paddle1.height / 2) {
			paddle1.velocity.y = Config.paddle1.reactiveness;
		} else {
			paddle1.velocity.y = 0;
		}
	// move right if right key hit and motion viable
	} else if (_keyCode == 39) {
		if (paddle1.position.y > -Config.field.height / 2 + Config.paddle1.height / 2) {
			paddle1.velocity.y = -Config.paddle1.reactiveness;
		} else {
			paddle1.velocity.y = 0;
		}
	} else {
		paddle1.velocity.y = 0;
	}

	// progress in time
	paddle1.position.y += paddle1.velocity.y;
}
var animatePaddle2 = function () {
	// paddle2 moves towards the ball
	paddle2.velocity.y = (ball.position.y - paddle2.position.y) * Config.paddle2.sensitivity;

	// Define maximum speed of paddle2 to prevent instability
	if (paddle2.velocity.y > Config.paddle2.maxSpeed) {
		paddle2.velocity.y = Config.paddle2.maxSpeed;
	} else if (paddle2.velocity.y < -Config.paddle2.maxSpeed) {
		paddle2.velocity.y = -Config.paddle2.maxSpeed;
	}

	// progress in time
	paddle2.position.y += paddle2.velocity.y;
}

var animatePaddleBallInteractions = function () {
	// if ball intersects with paddle1, hit back
	if (ball.position.x <= paddle1.position.x + Config.paddle1.width &&  ball.position.x >= paddle1.position.x && ball.position.y <= paddle1.position.y + Config.paddle1.height / 2 &&  ball.position.y >= paddle1.position.y - Config.paddle1.height / 2) {
		if (ball.velocity.x < 0) {
			ball.velocity.x = -ball.velocity.x;
		}
	}
	
	// if ball intersects with paddle2, hit back
	if (ball.position.x <= paddle2.position.x + Config.paddle2.width &&  ball.position.x >= paddle2.position.x && ball.position.y <= paddle2.position.y + Config.paddle2.height / 2 &&  ball.position.y >= paddle2.position.y - Config.paddle2.height / 2) {
		if (ball.velocity.x > 0) {
			ball.velocity.x = -ball.velocity.x;
			ball.velocity.y -= paddle2.velocity.y;
		}
	}
}

var animateCamera = function () {
	// track paddle1
	camera.position.x = paddle1.position.x + Config.camera.x;
	camera.position.y = paddle1.position.y + Config.camera.y;
	camera.position.z = paddle1.position.z + Config.camera.z;
	
	// rotate to face our opponent
	camera.rotation.y = -Math.PI / 3;
	camera.rotation.z = -Math.PI / 2;
}

var reset = function () {
	ball.position.x = 0;
	ball.position.y = 0;

	ball.velocity.x = 0;
	ball.velocity.y = 0;

	// animate light
	ambientLight.color.set(Math.random() * 0xffffff);
}
var restart = function () {
	ball.position.x = 0;
	ball.position.y = 0;

	ball.velocity.x = 1;
	ball.velocity.y = 1;
}