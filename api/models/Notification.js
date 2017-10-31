/**
 * Notification.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	text: {
  		type: 'string',
  		required: true
  	},
  	action: {
  		type: 'string'
  	},
  	from: {
  		model: 'player'
  	},
  	game: {
  		model: 'game',
      required: true
  	},
    created: {
      type: 'datetime',
      defaultsTo: Date.now
    }
  }
};

