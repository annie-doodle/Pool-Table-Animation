var _keyCode;
var _timer;

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
	if (_keyCode == 32) {
		restart();
	}

	if (ball.position.x <= -Config.field.width / 2) {	
		reset();
	}
	
	if (ball.position.x >= Config.field.width / 2) {	
		reset();
	}
	
	if (ball.position.y <= -Config.field.height / 2) {
		ball.velocity.y = -ball.velocity.y;
	}	
	
	if (ball.position.y >= Config.field.height / 2) {
		ball.velocity.y = -ball.velocity.y;
	}
	
	ball.position.x += ball.velocity.x * Config.ball.speed;
	ball.position.y += ball.velocity.y * Config.ball.speed;
}

var animatePaddle2 = function () {
	paddle2.velocity.y = (ball.position.y - paddle2.position.y) * Config.paddle2.sensitivity;

	if (paddle2.velocity.y > Config.paddle2.maxSpeed) {
		paddle2.velocity.y = Config.paddle2.maxSpeed;
	} else if (paddle2.velocity.y < -Config.paddle2.maxSpeed) {
		paddle2.velocity.y = -Config.paddle2.maxSpeed;
	}

	paddle2.position.y += paddle2.velocity.y;
}
var animatePaddle1 = function () {
	if (_keyCode == 37) {
		if (paddle1.position.y < Config.field.height / 2 - Config.paddle1.height / 2) {
			paddle1.velocity.y = Config.paddle1.reactiveness;
		}
		else {
			paddle1.velocity.y = 0;
		}
	}
	else if (_keyCode == 39) {
		if (paddle1.position.y > -Config.field.height / 2 + Config.paddle1.height / 2) {
			paddle1.velocity.y = -Config.paddle1.reactiveness;
		}
		else {
			paddle1.velocity.y = 0;
		}
	}
	else {
		paddle1.velocity.y = 0;
	}

	paddle1.position.y += paddle1.velocity.y;
}

var animatePaddleBallInteractions = function () {
	if (ball.position.x <= paddle1.position.x + Config.paddle1.width &&  ball.position.x >= paddle1.position.x && ball.position.y <= paddle1.position.y + Config.paddle1.height / 2 &&  ball.position.y >= paddle1.position.y - Config.paddle1.height / 2) {
		if (ball.velocity.x < 0) {
			ball.velocity.x = -ball.velocity.x;
		}
	}
	
	if (ball.position.x <= paddle2.position.x + Config.paddle2.width &&  ball.position.x >= paddle2.position.x && ball.position.y <= paddle2.position.y + Config.paddle2.height / 2 &&  ball.position.y >= paddle2.position.y - Config.paddle2.height / 2) {
		if (ball.velocity.x > 0) {
			ball.velocity.x = -ball.velocity.x;
			ball.velocity.y -= paddle2.velocity.y;
		}
	}
}

var animateCamera = function () {
	camera.position.x = paddle1.position.x + Config.camera.x;
	camera.position.y = paddle1.position.y + Config.camera.y;
	camera.position.z = paddle1.position.z + Config.camera.z;
	
	camera.rotation.y = -Math.PI / 3;
	camera.rotation.z = -Math.PI / 2;
}

var reset = function () {
	ball.position.x = 0;
	ball.position.y = 0;

	ball.velocity.x = 0;
	ball.velocity.y = 0;
}
var restart = function () {
	ball.position.x = 0;
	ball.position.y = 0;

	ball.velocity.x = 1;
	ball.velocity.y = 1;
}