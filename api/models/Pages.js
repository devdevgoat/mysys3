/**
 * Pages.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string'
    },
    map: {
      model: 'map',
      required: true
    },
    image: {
      type: 'string',
      defaultsTo: '/images/mapimages/map.png'
    },
    lines: {
      type: 'array'
    }
  }
};

