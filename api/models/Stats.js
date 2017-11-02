/**
 * Stats.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	player: {
  		model: 'player',
  		via: 'currentstats'
  	},
  	pe: {
  		type: 'int',
  		min: 0
  	},
  	me: {
  		type: 'int',
  		min: 0
  	},
  	se: {
  		type: 'int',
  		min: 0
  	},
  	le: {
  		type: 'int',
  		min: 0
  	}
  }
};

