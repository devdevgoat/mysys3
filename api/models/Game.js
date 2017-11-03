/**
 * Game.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	title: {
  		type: 'string',
  		unique: true,
  		required: true
  	},
  	players: {
  		collection: 'player',
  		via: 'game'
  	},
    minlvl: {
      type: 'int',
      defaultsTo: 1
    },
    about: {
      type: 'string',
      size: 10000
    },
    img: {
      type:'string'
    },
    gm: {
      model: 'user'
    },
    notifications: {
      collection: 'notification',
      via: 'game'
    },
    tile: {
      collection: 'tile',
      via: 'game'
    }
  }
};

