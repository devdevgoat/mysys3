/**
 * PlayerController
 *
 * @description :: Server-side logic for managing players
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers

 */

module.exports = {
	 getPlayers: function(req, res) {
		if(req.user){
			var players = Player.find({
				where: {
					user: req.user.id
				}
			}).exec(function (err, players) {
				if(err){return res.serverError(err);} 
					return res.view('playerlist',{players:players});
			});
		} else {
			return res.redirect('/login');
		}
       
    },

    createPlayer: function (req, res) {
		let gameId = (typeof req.param('gameId') === 'undefined') ? '' : req.param('gameId');
		let type = (typeof req.param('type') === 'undefined') ? 'pc' : req.param('type');
    		req.file('avatar').upload({
			  dirname: require('path').resolve(sails.config.appPath, 'assets/images/playerimgs/')
			},function (err, uploadedFiles) {
			  	if (err) {return res.negotiate(err);}
			  	var filename= 'unknown.png'
				  if(uploadedFiles.length != 0){ // Check the number of files uploaded.
					//account for mac/windows
					let lastSlash=(uploadedFiles[0].fd.lastIndexOf('/') === -1 ) ? uploadedFiles[0].fd.lastIndexOf('\\') : uploadedFiles[0].fd.lastIndexOf('/');
					filename = uploadedFiles[0].fd.substring(lastSlash + 1);
				} 
				Player.create({
					name: req.param('playername'),
					type: type,
					backstory: req.param('backstory'),
					maxpe: req.param('pe'),
					maxme: req.param('me'),
					maxse: req.param('se'),
					image: '/images/playerimgs/'+filename,
					user: req.user,
					game: '59f6350a7272ba8104caef4b'
					}).exec(function (err, newplayer) {
						if(err){return res.serverError(err);}
						if(type=='pc'){
							return res.redirect('/readyplayer1');
						} 
						if(type =='npc'){
							Player.publishCreate(newplayer);
							return res.redirect('/gm/'+gameId);
						}
						
					});
			});

	},
	

    createForm: function (req, res) {
    	res.view('createplayer');
	},
	
	killPlayer: function (player) {
		//drop all their shit
		Inventory.findOne({player:player.id}).populate('player').populate('item').limit(1).exec(function(err, inv){
			if (err) { console.log('failed to find Inventory:'+ err); }
			//not working
		   inv.item.forEach(function(item){
			sails.controllers.inventory.autoDrop(item.id, player.id, '0.0');
		   }); //end for loop
		  });

		//change their status to dead
		Player.update(player.id,{state:'dead'}).exec(function (err, updated) {
            if (err) { console.log('failed updating player state:'+ err); }
            console.log('Player state updated to dead');
		  });
		//remove from game
		Game.findOne(player.game).exec(function(err, game){
			if (err) {return res.negotiate(err);}
			game.players.remove(player.id);
			game.save();
			Game.publishRemove(game.id,'players',player.id);
		});
		
		//post the note
		Notification.create({game:player.game,text:player.name+' died!'}).exec(function (err,records) {
			if (err) { console.log('failed creating note:'+ err); }
			});
	}

};

