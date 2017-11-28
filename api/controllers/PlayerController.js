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
					sails.log(players);
					return res.view('playerlist',{players:players});
			});
		} else {
			return res.redirect('/login');
		}
       
    },

    createPlayer: function (req, res) {
		let type = (typeof req.param('type') === 'undefined') ? 'pc' : req.param('type');
    		req.file('avatar').upload({
			  dirname: require('path').resolve(sails.config.appPath, 'assets/images/playerimgs/')
			},function (err, uploadedFiles) {
			  	if (err) {return res.negotiate(err);}
			  	var filename= 'unknown.png'
			  	if(uploadedFiles.length != 0){ // Check the number of files uploaded.
					filename = uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('/') + 1);
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
						sails.log('New player create with id',newplayer.id);
						if(type=='pc'){
							return res.redirect('/readyplayer1');
						} 
						if(type =='npc'){
							Player.publishCreate(newplayer);
							return res.view('createnpc');
						}
						
					});
			});

	},
	

    createNpcForm: function (req, res) {
    	res.view('createnpc');
    },

    createForm: function (req, res) {
    	res.view('createplayer');
    },

};

