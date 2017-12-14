/**
 * Player.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
	user: {
		model: 'user'
	},
	name: {
		type: 'string',
		size: 255, //lengith
		required: true,
		defaultsTo: 'No Name Sam', //can use functions here
	},
	type: {
		type: 'string',
		enum: 'npc, pc',
		defaultsTo: 'pc' //can use functions here
	},
	lvl: {
		type: 'int',
		defaultsTo: 1
	},
	backstory: {
		type: 'string',
		size: 255, //lengith
		defaultsTo: 'A new player'
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
	inventory: {
		collection: 'inventory',
		via: 'player'
	},
	le: {
		type: 'integer',
		max: 100,
		defaultsTo: 100,
		min: 0
	},
	state: {
		type: 'string',
		size: 255, //lengith
		defaultsTo: 'alive'
	}, 
    currentstats: { //https://sailsjs.com/documentation/concepts/models-and-orm/associations/one-to-one
      collection: 'stats', //collectoin -> model will result in automatic sync by creating the stats and tying the player to it
      via: 'player'
    }
  },

  afterCreate: function (newlyInsertedRecord, cb) {
  	sails.log('Generating stats');
	Stats.create({
		player: newlyInsertedRecord,
		pe: newlyInsertedRecord.maxpe,
		se: newlyInsertedRecord.maxse,
		me: newlyInsertedRecord.maxme,
		pm: 0,
		mm: 0,
		sm: 0,
		le: 100
	}).exec(function (err, currentstats) {
		if(err) return cb(err);
		sails.log('Generating Inventory');
		Inventory.create({
			player: newlyInsertedRecord
		}).exec(function (err, inventory) {
			if(err){return res.serverError(err);}
			cb();
		});
	});
  }

};

