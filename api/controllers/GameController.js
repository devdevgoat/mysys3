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

	getGmGames: function (req, res) {
			//if not, then let them choose one
			Game.find().populate('gm',{id:req.user.id}).exec(function (err, games) {
				if(err){return res.serverError(err);} 
				console.log(games);
				return res.view('games',{games:games});
			});
	},

	joinGame: function (req,res) {
		let gameId = req.param('gameId');
		let npcId = req.param('npcId');
		let entranceText = (typeof req.param('entranceText') === 'undefined') ? ' joined the party!' : req.param('entranceText');
		
		if(req.session.player){
			Player.findOne(req.session.player.id).populate('inventory').exec(function (err, selPlayer) {
		    	Game.findOne(gameId).populate('notifications').populate('players').exec(function (err,selGame) {
		    		if(err){return res.serverError(err);}
		    		req.session.game=selGame;
		    		//Player.findOne(req.session.player.id).populate('inventory').exec(function (err, selPlayer) {
						if(selPlayer.game!=gameId){
							selGame.players.add(selPlayer);
							selGame.save();
							Game.publishAdd(gameId,'players',selPlayer);
						Notification.create({game: gameId, text:selPlayer.name + entranceText}).exec(function (err,records) {
							if (err) { return res.serverError(err); }
						});
					}
			    		return res.view('charactersheet');
		    		//});
		    	});
			});
		 } else {
		    	return res.redirect('/readyplayer1');
		    }
	},


	gmGame: function (req,res) {
		let gameId = req.param('gameId');
		let npcId = req.param('npcId');
		let entranceText = (typeof req.param('entranceText') === 'undefined') ? ' joined the party!' : req.param('entranceText');
		
		Game.findOne(gameId).populate('notifications').populate('players').exec(function (err,selGame) {
			if(err){return res.serverError(err);}
			req.session.game= selGame;
			return res.view('gm2',{game:selGame});
		});
		    
	},
	
	addNpc: function (req,res) {
		let gameId = req.param('gameId');
		let npcId = req.param('playerId');
		let entranceText = (typeof req.param('entranceText') === 'undefined') ? ' came into view.' : req.param('entranceText');
		Game.findOne(gameId).exec(function (err,selGame) {
			if(err){return res.serverError(err);}
			Player.findOne(npcId).populate('inventory').exec(function (err, selPlayer) {
				selGame.players.add(selPlayer);
				selGame.save();
				Game.publishAdd(gameId,'players',selPlayer);
				Notification.create({game:gameId, text: selPlayer.name + ' ' +entranceText}).exec(function (err,records) {
					if (err) { return res.serverError(err); }
				});
				//return res.view('addnpc');
				return res.ok();
			});
		});
	},
	
	removeNpc: function (req,res) {
		let gameId = req.param('gameId');
		let npcId = req.param('npcId');
		let exitText = (typeof req.param('exitText') === 'undefined') ? ' left.' : req.param('exitText');
		Game.findOne(gameId).exec(function (err,selGame) {
			if(err){return res.serverError('Error on game.findone:'+err);}
			Player.findOne(npcId).populate('inventory').exec(function (err, selPlayer) {
				selGame.players.remove(selPlayer.id);
				selGame.save();
				Game.publishRemove(selGame.id,'players',selPlayer.id);
				Notification.create({game:gameId, text: selPlayer.name + ' ' +exitText}).exec(function (err,records) {
					if (err) { return res.serverError(err); }
				});
				return res.ok();
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

