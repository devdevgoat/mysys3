/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getGames: function (req, res) {
		if(req.session.gameId){
			sails.log('Storing game id.');
			return res.redirect('/g/'+req.session.gameId);
		}
		if(!req.session.user){
			sails.log('No user id in session, need to log in');
			return res.redirect('/login');
		}
		if(!req.param('playerId')){
			sails.log('No player selected');
			return res.redirect('/readyplayer1');
		}
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
		req.session.gameId = req.param('gameId');
		if(!req.session.user ) {
			return res.redirect('/login');
		}
		if(!req.session.player){
			return res.redirect('/readyplayer1');
		}

		sails.log('User ' + req.session.user.id + ' is joining game ' + req.session.gameId + ' with player ' + req.session.player.name);
    	Game.find(req.param('gameId')).populate('notifications').exec(function (err,game) {
    		if(err){return res.serverError(err);}
    		req.session.game= game[0];
    		console.log(game);
    		data = {
    			game: game,
    			player: req.session.player
    		};
    		console.log(data);
    		return res.view('charactersheet',{
    			game: game[0],
    			player: req.session.player
    		});
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

