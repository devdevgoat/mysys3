/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getGames: function (req, res) {
		Player.find(req.param('playerId'))
			.exec(function (err, player) {
	       		if(err){return res.serverError(err);} 
	       		sails.log('Found this player:', player);
	       		Game.find({
			       		minlvl: {
			       			">=" : player.lvl
			       		}
			       }).exec(function (err, games) {
			       		if(err){return res.serverError(err);} 
			       		sails.log('Found these games:', games);
			       		return res.view('lobby',{games:games});
			       });
	       });
	}
};

