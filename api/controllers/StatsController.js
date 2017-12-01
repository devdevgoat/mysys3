/**
 * StatsController
 *
 * @description :: Server-side logic for managing stats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	//manual stats adjustment via http
   updateStats: function (req, res) {
   		//need player id
   		let statsid = req.param('statsid');
   		let stat = req.param('stat');
   		let val = req.param('val');
   		let updateTo = {};
		
		Stats.findOne(statsid).exec(function (err, currStats) {
			if (err) return res.serverError(err);
			let newVal = parseInt(currStats[stat]) + parseInt(val);
			updateTo[stat] = newVal.toString();
			Stats.update(statsid, updateTo).exec(function (err, updated) {
				if (err) return res.serverError(err);
			});
		});
		return res.redirect('/editstats');
   },

   //c2c stats adjustment
   updateStats: function (statsid, stat, val) {
	   	stat = stat.toLowerCase();
   		let updateTo = {};
		Stats.findOne(statsid).exec(function (err, currStats) {
			if (err) return res.serverError(err);
			let newVal = parseInt(currStats[stat]) + parseInt(val);
			updateTo[stat] = newVal.toString();
			Stats.update(statsid, updateTo).exec(function (err, updated) {
				if (err) console.log('Failed updating stats:'+err);;
			});
		});
   },

   listPlayersForGm: function (req,res) {
		   Player.find().populate('currentstats').exec(function (err,players) { //will need a game filter {game:req.session.game.id}
	         if(err){return res.serverError(err);}
	         res.view('editstat',{players:players});
	      });
   }
};

