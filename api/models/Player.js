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
	lvl: {
		type: 'int',
		defaultsTo: 1
	},
	backstory: {
		type: 'string',
		size: 255, //lengith
	},
	user: {
		model: 'user'
	},
	inventory: {
		collection: 'inventory',
		via: 'player'
	},
	maxpe: {
		type: 'integer',
		max: 99,
		defaultsTo: 33
	},
	maxme: {
		type: 'integer',
		max: 99,
		defaultsTo: 33
	},
	maxse: {
		type: 'integer',
		max: 99,
		defaultsTo: 33
	},
	game: {
		model: 'game',
		via: 'players'
	},
	ailment : {
		type: 'string'
	},
    currentstats: {
      model: 'stats',
      via: 'player'
    },
    currenttile: {
    	model: 'tile',
    	via: 'players',
    	defaultsTo: '[0,0]'
    }
  }

};

