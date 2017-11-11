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
  beforeUpdate: function (toUpdate, cb) {
    console.log(toUpdate);
  },
  afterUpdate: function (values,cb){
    newStats = {
      id: values.id,
      pe: values.pe+values.pm,
      se: values.se+values.sm,
      me: values.me+values.mm
    };
    console.log('sending new stats');
    console.log(newStats);
    Stats.publishUpdate(values.id, newStats);
    cb();
  }
};

