/**
 * Tile.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	pos: {
  	  type: 'array',
      defaultsTo: '[0,0]',
      required: true
  	},
  	terrain: {
  		type: 'string'
  	},
  	game: {
  		model: 'game',
  		via: 'tile'
  	},
  	players: {
  		collection: 'player',
  		via: 'currenttile'
  	}
  }
};

