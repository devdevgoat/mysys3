/**
 * StuffController
 *
 * @description :: Server-side logic for managing stuffs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	pickup: function (req, res) {
        let socketId = sails.sockets.getId(req);
		let gameId = req.param('gameId');
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

			    sails.controllers.inventory.autoAddToInventory (itemId, playerId) ;
                return res.ok();
            } 
		});
    },
    
    trash: function (req, res) {
        let socketId = sails.sockets.getId(req);
		let gameId = req.param('gameId');
		let dropKey = req.param('dropKey');
        let noteId = req.param('noteId');
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
                Notification.create({game:gameId,text:'The item is lost!'}).exec(function (err,records) {
                if (err) { return res.serverError(err); }
                });
			    //sails.controllers.inventory.autoAddToInventory (itemId, playerId) ;
                return res.ok();
            } 
		});
	}
};

