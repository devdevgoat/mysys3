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
  		backstory: {
  			type: 'string',
  			size: 255, //lengith
  		},
  		user: {
  			model: 'user'
  		},
      maxpe: {
        type: 'integer',
        max: 99
      },
      maxme: {
        type: 'integer',
        max: 99
      },
      maxse: {
        type: 'integer',
        max: 99
      },
  		items: {
  			collection:'item',
  			via: 'players'
  		},//,spells: {collection:'spell'},weapons: {collection:'weapon'}
      game: {
        model: 'game',
        via: 'players'
      }
  }

};

