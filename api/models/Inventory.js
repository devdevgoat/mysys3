/**
 * Inventory.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	player: {
  		model: 'player'
  	},
  	item: {
  		model: 'item'
  	},
  	quantity: {
  		type: 'int',
  		minimum: 0,
  		defaultsTo: 1
  	}
  }
};

