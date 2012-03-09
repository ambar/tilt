/**
 * Weapon: Bomb
 */
define(function(require, exports, module) {

var entities = require('../../wo/entities'),
	Entity = entities.Entity;

exports.Bomb = Entity.extend({
	init : function(x,y,radius,color) {
		// this._super(x,y,8,'red')
	},
	draw : function(ctx) {
		
	}
})

})