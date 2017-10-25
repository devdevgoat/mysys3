/**
 * PlayerController
 *
 * @description :: Server-side logic for managing players
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	 getPlayers: function(req, res) {
       var players = Player.find({
       	where: {
       		user: req.user.id
       	}
       }).exec(function (err, players) {
       		sails.log(players);
       		res.view('playerlist',{players:players});
       });

       
    },

    createPlayer: function (req, res) {
    	req.file('avatar').upload({
			  dirname: require('path').resolve(sails.config.appPath, 'assets/images/playerimgs/')
			},function (err, uploadedFiles) {
				sails.log('**** ', uploadedFiles);
			  	if (err) {return res.negotiate(err);}
				Player.create({
					name: req.param('playername'),
					backstory: req.param('backstory'),
					maxpe: req.param('pe'),
					maxme: req.param('me'),
					maxse: req.param('se'),
					image: 'playerimgs/'+uploadedFiles.name,
					user: req.user
					}).exec(function (err, newplayer) {
						if(err){return res.serverError(err);}
						sails.log('New player create with id',newplayer.id);
						newplayer.save();
						return res.redirect('/lobby');
					});
			});

    },

    createForm: function (req, res) {
    	res.view('createplayer');
    },

    select: function (req,res) {
    	sails.log('player id:',req.param('playerId'));
    	Player.find(req.param('playerId')).exec(function (err,player) {
    		if(err){return res.serverError(err);}

    		sails.log({player});
    		res.view('charactersheet',{player:player});
    	});
    }
};

