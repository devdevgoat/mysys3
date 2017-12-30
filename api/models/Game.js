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
    rooms: {
      collection: 'room',
      via: 'game'
    },
    maps: {
      collection: 'map',
      via: 'game'
    },
    activemap: {
      model: 'map'
    }
  },
  afterCreate: function (createdRecords, cb) {
    Room.create({'game':createdRecords.id}).exec(function (err, room) {
      console.log('Created a room:'+room.id);
    });
    Map.create({'game':createdRecords.id}).exec(function (err, map) {
      console.log('Created a map:'+map.id);
      Game.update(createdRecords.id,{activemap:map.id}).exec(function (err, game) {
        console.log('Assigned active map:'+map.id+' to game:'+createdRecords.id);
      });
    });
    cb();
  }
};

