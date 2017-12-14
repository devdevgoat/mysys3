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
  		unique: true
  	},
    pe: {
      type: 'int'
    },
    me: {
      type: 'int'
    },
    se: {
      type: 'int'
    },
    pm: {
      type: 'int'
    },
    mm: {
      type: 'int'
    },
    sm: {
      type: 'int'
    },
  	le: {
  		type: 'int'
    },
    ail: {
      type: 'string'
    },
    gold: {
      type: 'int'
    }
  },
  afterUpdate: function (values,cb){
    newStats = {
      player: values.player.id,
      id: values.id,
      pe: parseInt(values.pe) + parseInt(values.pm),
      se: parseInt(values.se) + parseInt(values.sm),
      me: parseInt(values.me) + parseInt(values.mm),
      le: parseInt(values.le),
      ail: values.ail,
      gold: values.gold
    };
    Stats.publishUpdate(values.id, newStats);
    cb();
  }
};

