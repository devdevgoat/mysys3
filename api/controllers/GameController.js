/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getGames: function (req, res) {
			//does the player already have a game they want to join (via a link)
			if(req.session.gameId){
				sails.log('Already has game id, redirecting to game '+req.session.gameId);
				return res.redirect('/g/'+req.session.gameId);
			} 
			//if not, then let them choose one
			Game.find().populate('gm').exec(function (err, games) {
	       		if(err){return res.serverError(err);} 
	       		return res.view('games',{games:games});
       		});
	},

	joinGame: function (req,res) {
		sails.log('User ' + req.session.user.name + ' is joining game ' + req.session.gameId + ' with player ' + req.session.player.name);
    	Game.find(req.param('gameId')).populate('notifications').exec(function (err,game) {
    		if(err){return res.serverError(err);}
    		req.session.game= game[0];
    		return res.view('charactersheet');
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

