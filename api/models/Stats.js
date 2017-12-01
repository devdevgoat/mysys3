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
  	}
  },
  afterUpdate: function (values,cb){
    let note = '';
    let alert = false;
    let remove = false;
    if (values.le > 0 && values.le < 10)
    {
        note = ' doubles over in pain.';
        alert = true;
    }
    else if (values.le <=0)
    {
      note =  ' perished.';
      remove = true;
      alert = true;
    }
    
    
    newStats = {
      id: values.id,
      pe: parseInt(values.pe) + parseInt(values.pm),
      se: parseInt(values.se) + parseInt(values.sm),
      me: parseInt( values.me) + parseInt(values.mm),
    };
    Stats.publishUpdate(values.id, newStats);

    if(alert){
      Player.findOne(values.player).populate('inventory').exec(function(err, player){
        if(player.id){
          
          if(remove){
            //drop all their shit
            Inventory.findOne(player.inventory[0].id).exec(function(err, inv){
              //not working
              inv.item.forEach(function (item) {
                console.log('trying to drop item:');
                console.log(item);
               // sails.controllers.inventory.autoDrop(item.id, player.id, '0.0');
              });
              //kill them...
              //Player.destroy(player.id);
              //remove from game
              //Game.publishRemove...
            });
          }
          Notification.create({game:player.game,text:player.name+note}).exec(function (err,records) {
          if (err) { console.log('failed creating note:'+ err); }
          });
        }
        
      });
    }
    cb();
  }
};

