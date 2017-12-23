/**
 * Item.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	name: {
  			type: 'string',
  			size: 255, //lengith
  			required: true
  		},
  	desc: {
  			type: 'string',
  			size: 255 //lengith
  		},
  	ailment:{
        type: 'string',
        size: 255, //lengith
  		},
  	action: {
  		type: 'string',
  		defaultsTo: 'cure',
  		enum: 'cure,inflict'
  	},
  	target: {
  		type: 'string',
  		required: true,
  		defaultsTo: 'LE',
  		enum: 'LE,SE,ME,PE,AIL,le,se,me,pe,ail'
  	},
  	amount: {
  		type: 'integer',
  		required: true,
  		defaultsTo: 1
  	},
    type: {
      string: 'string',
      enum: 'equipment,item,spell',
      required: true,
      defaultsTo: 'item'
	},
	createdBy: {
		string: ''
	}
	}
};

