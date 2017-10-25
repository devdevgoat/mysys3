/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getGames: function (req, res) {
		Player.find({
	       	where: {
	       		user: req.param('playerId')
	       	}
	       }).exec(function (err, player) {
	       		if(err){return res.serverError(err);} 
	       		sails.log('Found this player:', player);
	       		Game.find({
			       	where: {
			       		minlvl: {
			       			">=" : player.lvl
			       		}
			       	}
			       }).exec(function (err, games) {
			       		if(err){return res.serverError(err);} 
			       		sails.log('Found these games:', games);
			       		res.view('lobby',{games:games});
			       });
	       });
	}
};

