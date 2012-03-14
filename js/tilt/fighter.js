/**
 * Player : Fighter
 */
define(function(require, exports, module) {

var Entity = require('../wo/entities').Entity

var Fighter = Entity.extend({
	speed_x : 140,
	speed_y : 140,
	// 碰撞半径
	radius : 10,
	// 朝向弧度
	// radian : -Math.PI,

	init : function(x,y,color) {
		this._super(x,y)
		// collider
		this.color  = color || '#eee'
		this.radian = -Math.PI
	},

	update : function(dt) {
		// console.log('update',dt)
		this._super(dt)
	},
	// 外形：火影手里剑
	draw : function(ctx) {

		ctx.save()
		
		ctx.fillStyle = this.color
		ctx.beginPath()

		ctx.translate(this.x,this.y)
		ctx.rotate(this.radian)
		ctx.scale(.4,.4)
		
		ctx.moveTo(10,9)
		ctx.lineTo(0,20)
		ctx.lineTo(-60,0)
		ctx.lineTo(0,-20)
		ctx.lineTo(10,-9)
		ctx.bezierCurveTo(40,-40,40,40,10,9)


		ctx.fill()
		ctx.restore()
	}
})

exports.Fighter = Fighter

})