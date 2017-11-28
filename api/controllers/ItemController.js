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

    let targets = req.param('targets'); //will be an array
    let inventoryId = req.param('inventoryId');
    let itemId = req.param('itemId');
    let gameId = req.param('gameId');
    let playerId = req.param('playerId');
    // don't drive uses off item keys, use use keys to lookup item ids from the inventorylet item = req.param('itemId'); //will be a string of item id
    
    //search the inventory, despite the item id being given to preven false calls
    Inventory.findOne(inventoryId).populate('item', itemId).exec(function(err, inventory){
      if (err) {return res.negotiate(err);}
      if(inventory.item[0]){
        //apply the affects to the target player stats

        //lookup target player
        //lookup source player name... 
        //lookup 
        //post notification
        let note = playerId + ' used ' + inventory.item[0].name + ' on ' +targets;
        Notification.create({game:gameId,text:note}).exec(function (err,records) {
          if (err) { return res.serverError(err); }
        });
      } else {
        console.log('That item is not in your inventory... hmmm, what are you trying to do, exactly? I\'m just going to log that...');
      }
    });

  },
    createItem: function (req, res) {
        req.file('image').upload({
        dirname: require('path').resolve(sails.config.appPath, 'assets/images/itemimages/')
      },function (err, uploadedFiles) {
          if (err) {return res.negotiate(err);}
          if(uploadedFiles[0]){
            var filename = '/images/itemimages/'+ uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('/') + 1);
          console.log(filename);
          sails.log('**** ', uploadedFiles);
          } else {
            var filename = '#';
          }
        Item.create({
          name: req.param('name'),
          desc: req.param('desc'),
          amount: req.param('amount'),
          type: req.param('type'),
          target: req.param('target'),
          action: req.param('action'),
          image: filename
          }).exec(function (err, newgame) {
            if(err){return res.serverError(err);}
            sails.log('New item created with id',newgame.id);
            res.view('createitem'); //should take you straigh to gm board really
          });
      });
   },
   listItems: function (req, res) {
     Item.find().exec(function (err,items) {
      if(err){return res.serverError(err);}
       Player.find().exec(function (err,players) { //will need a game filter {game:req.session.game.id}
         if(err){return res.serverError(err);}
         res.view('giveitem',{items:items, players:players});
      });
     });
   }
};

