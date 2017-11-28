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
    pm: {
      type: 'int',
      min: 0
    },
    mm: {
      type: 'int',
      min: 0
    },
    sm: {
      type: 'int',
      min: 0
    },
  	le: {
  		type: 'int',
  		min: 0
  	}
  },
  afterUpdate: function (values,cb){
    newStats = {
      id: values.id,
      pe: parseInt(values.pe) + parseInt(values.pm),
      se: parseInt(values.se) + parseInt(values.sm),
      me: parseInt( values.me) + parseInt(values.mm),
    };
    Stats.publishUpdate(values.id, newStats);
    cb();
  }
};

