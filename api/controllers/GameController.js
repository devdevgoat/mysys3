/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getGames: function (req, res) {
		sails.log(req.param('playerId'));
		Player.find(req.param('playerId')).exec(function (err, player) {
			if(err){return res.serverError(err);} 
			if(!player){
				sails.log('couldn\'t find player ' + req.param('playerId'));
				return res.redirect('/createplayer'); 
			}
			//set the player in the session
			req.session.player = player[0];
			//sails.log('User ' + req.session.user.id + ' selected player ' + player[0].name);
			sails.log('Choose from on of these game:');
			Game.find().populate('gm').exec(function (err, games) {
	       		if(err){return res.serverError(err);} 
	       		sails.log(games);
	       		res.view('games',{games:games});
       		});
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
				let filename = uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('/') + 1);
				console.log(filename);
				sails.log('**** ', uploadedFiles);
			  	if (err) {return res.negotiate(err);}
				Game.create({
					title: req.param('title'),
					about: req.param('about'),
					image: '/images/gameimages/'+filename,
					gm: req.user
					}).exec(function (err, newgame) {
						if(err){return res.serverError(err);}
						sails.log('New game create with id',newgame.id);
						newgame.save();
						return res.redirect('/readyplayer1'); //should take you straigh to gm board really
					});
			});

    },

};

