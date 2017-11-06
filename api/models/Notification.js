/**
 * Notification.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 //to create: http://localhost:8091/Notification/create/?game=59f6350a7272ba8104caef4b&text=this%20is%20a%20test

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
  	}
  },

  afterCreate: function (newlyCreatedRecord, cb) {
    Game.publishAdd(newlyCreatedRecord.game,'notifications',newlyCreatedRecord);
    cb();
  }
};

