/**
 * ItemController
 *
 * @description :: Server-side logic for managing items
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	  useItem: function (req,res) { 

    //using an item will result in an update to a players stats
    //to use an item you must have at least one target player

    let targets = req.param('targets'); //will be an array eventaully.. would need to loop trhough in the Player.findONe
    let inventoryId = req.param('inventoryId');
    let itemId = req.param('itemId');
    let gameId = req.param('gameId');
    let playerId = req.param('playerId');
    //search the inventory, despite the item id being given to prevent false calls
    Inventory.findOne(inventoryId).populate('player').populate('item', itemId).exec(function(err, inv){
      if (err) {return res.negotiate(err);}
      if(inv){
        if(inv.item[0]){
          //lookup attacker stats
      Stats.findOne({player:playerId}).exec(function (err,attackerStats){
        if (err) {return res.negotiate(err);}
        if(attackerStats){
          let stat = inv.item[0].target.toLowerCase();
          let val = (stat!='ail') ? parseInt(inv.item[0].amount) :inv.item[0].ailment ;
          let oneTimeUse = false;
          //lookup target player statsid
          Stats.findOne({player:targets}).populate('player').exec(function(err, stats){
            if(stats){
            if (err) {return res.negotiate(err);}
            let note = inv.player.name;
            // let note = inv.player.name + desc1 + stats.player.name + desc2 + inv.item[0].name;
            switch (inv.item[0].type) {
              case 'equipment':
                val = parseInt(val) + parseInt(attackerStats[stat]);
                note += ' hit '+stats.player.name+' with '+ inv.item[0].name;
              break;
              case 'item':
                oneTimeUse = true;
                note += ' used '+stats.player.name+' on '+ inv.item[0].name;
              break;
              case 'spell':
                note += ' cast '+ inv.item[0].name +' on '+ stats.player.name;
              if(parseInt(attackerStats.se)>=parseInt(inv.item[0].amount)){
                sails.controllers.stats.updateStatsAutoSimple(attackerStats.id,'se', parseInt(inv.item[0].amount)*-1);
              } else {
                note +=' but didn\'t have enough energy!';
                Notification.create({game:gameId,text:note}).exec(function (err,records) {
                  if (err) { return res.serverError(err); }
                });
                return;
              }
              break;
              default:
                break;
            }
              //remove the used item from the players inventory
              if(oneTimeUse){
                inv.item.remove(itemId);
                inv.save();
                Inventory.publishRemove(inv.id,'item',itemId);
              }
              sails.controllers.stats.updateStatsAuto(stats.id, inv.item[0].action,stat, val);
              Notification.create({game:gameId,text:note}).exec(function (err,records) {
                if (err) { return res.serverError(err); }
              });
            } else {
              console.log('Unable to find stats for player:'+targets);
            }
          }); 
        }
     }); //end stats lookup
      } else {
        console.log('That item is not in your inventory... hmmm, what are you trying to do, exactly? I\'m just going to log that...');
      }
    } else {
      console.log('Inventory not returned for id:'+inventoryId +' and item:'+ itemId);
    }
  }); //end invetory lookup
  },
    createItem: function (req, res) {
      //   req.file('image').upload({
      //   dirname: require('path').resolve(sails.config.appPath, 'assets/images/itemimages/')
      // },function (err, uploadedFiles) {
      //     if (err) {return res.negotiate(err);}
      //     if(uploadedFiles[0]){
      //       var filename = '/images/itemimages/'+ uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('/') + 1);
      //     console.log(filename);
      //     sails.log('**** ', uploadedFiles);
      //     } else {
      //       var filename = '#';
      //     }
        Item.create({
          name: req.param('name'),
          desc: req.param('desc'),
          amount: req.param('amount'),
          type: req.param('type'),
          target: req.param('target'),
          action: req.param('action'),
          ailment: req.param('ailment'),
          createdBy: req.param('createdBy')
          }).exec(function (err, newitem) {
            if(err){return res.serverError(err);}
            //res.view('createitem'); //should take you straigh to gm board really
            res.json(newitem);
          });
   },
   listItems: function (req, res) {
     Item.find().exec(function (err,items) {
      if(err){return res.serverError(err);}
       Player.find().exec(function (err,players) { //will need a game filter {game:req.session.game.id}
         if(err){return res.serverError(err);}
         //res.view('giveitem',{items:items, players:players});
         res.ok();
      });
     });
   }
};

