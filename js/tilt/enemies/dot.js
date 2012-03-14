/**
 * enemy
 */
define(function(require, exports, module) {

var entities = require('../../wo/entities'),
	Entity = entities.Entity,
	Ball = entities.Ball;

exports.Dot = Ball.extend({
// exports.Dot = Entity.extend({
	radius : 8,
	speed : 40,
	color : 'red',
	collidable : true,
	lineWidth : 3,
	strokeStyle : 'white',
	maxPluseCount: 40,

	init : function(x,y) {
		this._super(x,y,8,this.color)
		this.pluse()
	},
	// 新生，脉动，无威胁
	pluse : function() {
		this.collidable = false

		var count = 0, self = this, _radius = self.radius;

		var update = function() {
			self.radius += Math.sin(count) * -1
			count += .5

			if( count > self.maxPluseCount ){
				self.radius = _radius
				self.collidable = true
				self.off('update',update)
			}
		}

		this.on('update',update)
	},

	update : function(dt) {
		this._super(dt)
	},
	draw : function(ctx) {
		this._super(ctx)

		// ctx.fillStyle = this.color;
		// ctx.beginPath();
		// ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,1);
		// ctx.fill();
		
		ctx.strokeStyle = this.strokeStyle
		ctx.lineWidth = this.lineWidth
		ctx.stroke()
	}
})

})