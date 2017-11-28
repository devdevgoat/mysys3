/**
 * StuffController
 *
 * @description :: Server-side logic for managing stuffs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	pickup: function (req, res) {
        let socketId = sails.sockets.getId(req);
		let gameId = req.param('game');
		let dropKey = req.param('dropKey');
        let noteId = req.param('noteId');
        let playerId = req.param('playerId');
        //search by game/dropKey combo and get the item id only on result
		Stuff.findOne({game: gameId,dropKey: dropKey}).exec(function(err, result){
            if (err) {return res.negotiate(err);}
            
            if(result){ //prevent full pile deletion
                //immidiately destroy the stuff
                Stuff.destroy(result.id).exec(function (err,deletedRecords) {
                    console.log('Destroyed stuff:');
                    console.log(deletedRecords);
                 });
                let itemId = result.itemId;
                //get the notification text
                Notification.findOne(noteId).exec(function(err, note){
                if (err) {return res.negotiate(err);}
                    //remove the link/dropkey
                    let linkLess = note.text.replace(/<a\b[^>]*>/i,"").replace(/<\/a>/i, "");
                    Notification.update(noteId,{text:linkLess}).exec(function (err,updated) {
                        if (err) {return res.negotiate(err);}
                        console.log(updated);
                        //Notification.publishUpdate(noteId, updated[0],req); //not working, might just go with a full server broadcast for now
                        let noteData = {
                            verb: 'updated',
                            id: updated[0].id,
                            data: {
                                text: linkLess
                            }
                        };
                        //NOT the best way.... but notifications are unique so...
                        sails.sockets.blast('notification',noteData); 
                    });
                });
                //add the item to the players inventory
                Player.findOne(playerId).populate('inventory').populate('currentstats').exec(function (err, player) {
                    Inventory.findOne(player.inventory[0].id).exec(function (err,inv) {
                        inv.item.add(itemId);
                        inv.save();
                        //have to lookup the item to send it to the player
                        Item.findOne(itemId).exec(function (err, item) {
                            //if equipment, add the modifier to the stats
                            if(item.type =='equipment'){
                                let updateTo = {};
                                let stat = item.target.toLowerCase();
                                updateTo[stat] = parseInt(player.currentstats[0][stat]) + parseInt(item.amount);
                                Stats.update(player.currentstats[0].id,updateTo).exec(function (err, updated) {
                                    console.log('Player stats increased by '+parseInt(item.amount));
                                });
                            }
                            let data = {
                                verb: 'addedTo',
                                added: item
                            };
                            sails.sockets.broadcast(socketId,'inventory',data);
                        });
						return res.ok();
                    });
                })
            } 
		});
	}
};

