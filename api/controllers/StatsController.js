/**
 * StatsController
 *
 * @description :: Server-side logic for managing stats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
   updateStats: function (req, res) {
   		//need player id
   		let statsid = req.param('statsid');
   		let stat = req.param('stat');
   		let val = req.param('val');
   		let updateTo = {};
		
		console.log('searching for '+statsid);
		Stats.findOne(statsid).exec(function (err, currStats) {
			if (err) return res.serverError(err);
			let newVal = parseInt(currStats[stat]) + parseInt(val);
			updateTo[stat] = newVal.toString();
			console.log('found stats: ');
			console.log(currStats);
			Stats.update(statsid, updateTo).exec(function (err, updated) {
				if (err) return res.serverError(err);
				//Stats.publishUpdate(statsid, updateTo);

			console.log('Updated stats');
			console.log(updated);
			});
		});

		return res.redirect('/editstats');
   },

   listPlayersForGm: function (req,res) {
		   Player.find().populate('currentstats').exec(function (err,players) { //will need a game filter {game:req.session.game.id}

	         if(err){return res.serverError(err);}
	         res.view('editstat',{players:players});
	      });
   }
};

