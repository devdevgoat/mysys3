/**
 * Map.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type:'string'
    },
    game: {
      type:'string'
    },
    pages: {
      collection: 'pages',
      via: 'map'
    },
    activepage: {
      model: 'pages'
    }
  },
  afterCreate: function (createdRecords, cb) {
    Pages.create({'map':createdRecords.id,'name':'Page 1'}).exec(function (err, page) {
      console.log('Created initial page:'+page.id);
    });
    cb();
  }
};

