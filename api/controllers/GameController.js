/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getGames: function (req, res) {
			
			//if not, then let them choose one
			Game.find().populate('gm').exec(function (err, games) {
	       		if(err){return res.serverError(err);} 
	       		return res.view('games',{games:games});
       		});
	},

	joinGame: function (req,res) {
		sails.log('User ' + req.user.id + ' is joining game ' + req.session.gameId + ' with player ' + req.session.player.name);
    	Game.findOne(req.param('gameId')).populate('notifications').populate('players').exec(function (err,selGame) {
    		if(err){return res.serverError(err);}
    		req.session.game= selGame;
    		Player.findOne(req.session.player.id).populate('inventory').exec(function (err, selPlayer) {
    			console.log('joingame found this game:');
    			console.log(selGame);
    			if(err){return res.serverError(err);}
    			//Inventory.findOne(selPlayer.inventory[0].id).populate('item').exec(function (err,inv) {
				// 	selGame.players.add(selPlayer);
	   // 			selGame.save();
	   //  			console.log('sending these items:');
	   //  			console.log(inv.item);
	   //  			return res.view('charactersheet',{inventory:inv});
				// });
				req.session.inventoryId = selPlayer.inventory[0].id;
				console.log('req.session.inventoryId:'+req.session.inventoryId);
				selGame.players.add(selPlayer);
	    		selGame.save();
	    		return res.view('charactersheet');
    		});
	    		
	    		
    	});
    },


    createGame: function (req, res) {
    		req.file('image').upload({
			  dirname: require('path').resolve(sails.config.appPath, 'assets/images/gameimages/')
			},function (err, uploadedFiles) {
			  	if (err) {return res.negotiate(err);}
			  	if(uploadedFiles[0]){
			  		var filename = '/images/gameimages/'+ uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('/') + 1);
					console.log(filename);
					sails.log('**** ', uploadedFiles);
			  	} else {
			  		var filename = '#';
			  	}
				Game.create({
					title: req.param('title'),
					about: req.param('about'),
					image: filename,
					gm: req.user
					}).exec(function (err, newgame) {
						if(err){return res.serverError(err);}
						sails.log('New game create with id',newgame.id);
						newgame.save();
						return res.redirect('/readyplayer1'); //should take you straigh to gm board really
					});
			});
	 }
};

