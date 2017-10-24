/**
 * Player.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
  		name: {
  			type: 'string',
  			size: 255, //lengith
  			required: true,
  			defaultsTo: 'No Name Sam', //can use functions here
  		},
  		backStory: {
  			type: 'string',
  			size: 255, //lengith
  		},
  		isGm: {
  			type:'boolean',
  			defaultsTo: false
  		},
  		user: {
  			model: 'user'
  		},
  		inventory: {
  			collection: 'inventory',
  			via: 'player'
  		},
  		ailment : {
  			type: 'string'
  		},
  		maxpe: {
  			type: 'int'
  		},
  		maxse: {
  			type: 'int'
  		},
  		maxme: {
  			type: 'int'
  		}, 
  		stats: {
  			model: 'stats'
  		},
  		game: {
  			model: 'game',
  			via: 'player'
  		}
  }

};

