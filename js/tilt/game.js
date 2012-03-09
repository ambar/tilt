/*
* 所有游戏逻辑
*/
define(function(require, exports, module) {


var // requires eigine objects
	wo       = require('../wo/wo'),
	input    = require('../wo/input'),
	stage    = require('../wo/stage'),
	V        = require('../wo/vector'),
	Color    = require('../wo/color').Color,
	entities = require('../wo/entities'),
	pressed  = input.letterFromKeyCode,
	GameText = entities.GameText;

var // requires game objects
	Fighter = require('./fighter').Fighter,
	Dot = require('./enemies/dot').Dot


var // game variables
	debug           = false,
	tilt_multi      = 7,
	ismobile        = /mobile|iphone/i.test( navigator.userAgent ),
	log_motion      = document.querySelector('#log-motion'),
	log_orientation = document.querySelector('#log-orientation'),
	fighter         = null, 
	game_over       = false,
	game_over_text  = null,
	game_pause_text = null,
	game_start_text = null,
	dot_spwan_timer = null;

var on_fighter_update = function(e,dt) {
	
	var speed = 150
	if( input.isKeyDown('left') ){
		this.speed_x = -speed
	}else if ( input.isKeyDown('right') ){
		this.speed_x = speed
	}

	if( input.isKeyDown('up')  ){
		this.speed_y = -speed
	}else if ( input.isKeyDown('down') ){
		this.speed_y = speed
	}

	if( fighter.x + fighter.radius > stage.width ){
		fighter.x = stage.width - fighter.radius
	}else if( fighter.x - fighter.radius < 0 ){
		fighter.x = fighter.radius
	}

	if( fighter.y - fighter.radius > stage.height ){
		fighter.y = stage.height - fighter.radius
	}else if( fighter.y - fighter.radius < 0 ){
		fighter.y = fighter.radius
	}

	fighter.vx = dt * this.speed_x
	fighter.vy = dt * this.speed_y

	fighter.radian = Math.atan2( fighter.vy, fighter.vx ) + Math.PI

}

var on_dot_update = function(e,dt) {
	var dot = this;

	// kill
	if( dot.collidable 
		&& distance(dot,fighter) < (dot.radius + fighter.radius) 
	){
		game_lose()
	}

	// trace
	var radian = Math.atan2( fighter.y - dot.y, fighter.x - dot.x )
	dot.vx = Math.cos(radian) * dot.speed * dt
	dot.vy = Math.sin(radian) * dot.speed * dt
}

var distance = function(a,b) {
	return Math.sqrt( Math.pow(a.x - b.x,2) + Math.pow(a.y - b.y,2) )
}

var gen_game_text = function(info, size) {
	var txt = new GameText( stage.width/2, stage.height/2, info, size || stage.width/22 )
	txt.fontWeight = 'bold'
	txt.fontFamily = 'fantasy'
	return txt
}

var game_pause = function() {

}

var game_start = function() {
	fighter.on('update',on_fighter_update)

	// spawn dots
	dot_spwan_timer = setInterval(function() {
		if(game_over || !stage.running) return;

		var dot = new Dot( wo.rand(stage.width), wo.rand(stage.height) )
		dot.on('update',on_dot_update)
		stage.add( dot )
	},1000)

	stage.run()
}

var game_restart = function() {
	stage.reset()
	game_reset()
	setTimeout(game_start)
}

var game_reset = function() {
	game_over = false
	clearInterval(dot_spwan_timer)

	fighter = new Fighter( stage.width/2, stage.height/2 + 50 )
	stage.add( fighter )

	game_over_text = gen_game_text('GAME OVER')
	// stage.add(game_over_text)
	
	// game_start_text = gen_game_text('GAME START')
}

var game_lose = function() {
	console.warn('dead')
	game_over = true
	stage.pause().reset()
	stage.add(game_over_text)
}

var onkeydown = function(e) {
	var key = e.keyCode
			
	if( key === 32 ){
		stage.running = !stage.running
	}

	// console.log(e.keyCode)

	if( !e.metaKey && !e.ctrlKey ){
		e.preventDefault()
	}
}

var ondevicemotion = function(e) {
	var accel = e.accelerationIncludingGravity
	if( debug ){
		log_motion.textContent = log( accel, ['x', 'y', 'z'] )
	}
}

var log = function(data,keys) {
	return keys
		.map(function(k) {
			return k + ':\t' + ( null === data[k] ? 'null' : data[k].toFixed(2) )
		})
		.join('\n')
}

var tilt = function(x,y) {
	fighter.speed_x = x * tilt_multi
	fighter.speed_y = y * tilt_multi
}

var ondeviceorientation = function(e) {
	// [ e.alpha, e.beta, e.gamma ]
	if( debug ){
		log_orientation.textContent = log( e, ['alpha', 'beta', 'gamma'] )
	}
	tilt( e.gamma, e.beta )
}

var onorientationchange = function(e) {
	var orientation = window.orientation || 0
	if( debug ){
		document.title = orientation
	}

	// document.title = [orientation,stage.height,stage.width,window.innerWidth, window.innerHeight]
	// 356,320
	// 480,208
	stage.resize( window.innerWidth, window.innerHeight )
	stage.entities.forEach(function(entity) {
		var _x = entity.x
		entity.x = entity.y
		entity.y = _x
	})

	// hide address bar
	window.scrollTo(0, 1)
}

var onclick = function(e) {
	if( game_over ){
		// console.log('restart')
		game_restart()
	}
	e.preventDefault()
}

var game_init = function(canvas, width, height, scale) {

	stage.init(canvas, width, height, scale)

	game_reset()

	window.addEventListener( ismobile ? 'touchstart' : 'click', onclick )
	window.addEventListener( 'keydown', onkeydown )
	window.addEventListener( 'devicemotion', ondevicemotion )
	window.addEventListener( 'deviceorientation', ondeviceorientation )
	window.addEventListener( 'orientationchange', onorientationchange )

	// game_start()
	// return

	var countdown = gen_game_text( '3', 80 )

	setTimeout(function() {
		if( countdown.text-- === 1 ){
			stage.remove( countdown )
			game_start()
		}else{
			setTimeout(arguments.callee,1000)
		}
	},1000)
	stage.add( countdown )

}

module.exports = Object.create({
	init   : game_init,
	pause  : game_pause,
	restart: game_restart
},{
	debug : {
		get : function() { return debug },
		set : function(value) { debug = !!value }
	}
})

});