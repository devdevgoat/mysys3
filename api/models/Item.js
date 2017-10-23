/**
 * Item.js
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
  			defaultsTo: 'Potion of Life'
  		},

  	desc: {
  			type: 'string',
  			size: 255, //lengith
  			required: true,
  			defaultsTo: 'Restores 1 LE'
  		},

  	ailments: {
  			collection: 'ailment',
  			via: 'items'
  		},

  	action: {
  		type: 'string',
  		defaultsTo: 'cure',
  		enum: 'cure,inflict'
  	},

  	target: {
  		type: 'string',
  		required: true,
  		defaultsTo: 'LE',
  		enum: 'LE,SE,ME,PE'
  	},

  	amount: {
  		type: 'integer',
  		required: true,
  		defaultsTo: 1
  	},

  	players: {
  			collection: 'player',
  			via: 'items'
  		}

  }
};

