/*
* 引导入口, 启动游戏
*/
define(function(require, exports, module) {
	
	var TiltGame = require('./tilt/game');

	// canvas, 高, 宽, 缩放
	// TiltGame.init('#tilt-game', 960, 640, 1);
	TiltGame.init('#tilt-game', window.innerWidth, window.innerHeight, 1);
	TiltGame.debug = true
})