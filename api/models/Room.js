/**
 * Room.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    game: {
      model: 'game',
      required: 'true'
    },
    location: {
      type: 'string',
      defaultsTo: '0.0'
    }
  }
  //, can't do this because it will result in an infinit loop
  // afterUpdate: function (updated, cb) {
  //   Room.find(updated.id).exec(function (err, room) {
  //     let items = room.items;
  //     let keys = {};
  //     let key = '';
  //     items.forEach(function(item) {
  //       dropKey = Math.random().toString(36).substr(2, 15);
  //       keys[dropKey]=item.id;
  //     });
  //     console.log('Generated new drop key list: '+ JSON.stringify(keys));
  // update.... heres' the loop part
  //   });
  // cb();
  // }
};

