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
   		updateTo[stat]=req.param('val');
		switch(stat){ //gotta be a better way to do this...
			case 'pe':
				Stats.update(statsid,{pe:val}).exec(function (err, updated) {
   					if(err) return res.serverError(err);
   					Stats.publishUpdate(statsid,{pe:val});
   				});
			break;
			case 'me':
				Stats.update(statsid,{me:val}).exec(function (err, updated) {
   					if(err) return res.serverError(err);
   					Stats.publishUpdate(statsid,{me:val});
   				});

			break;
			case 'se':
				Stats.update(statsid,{se:val}).exec(function (err, updated) {
   					if(err) return res.serverError(err);
   					Stats.publishUpdate(statsid,{se:val});
   				});
			break;
			case 'pm':
				Stats.update(statsid,{pm:val}).exec(function (err, updated) {
   					if(err) return res.serverError(err);
   					Stats.publishUpdate(statsid,{pm:val});
   				});
			break;
			case 'mm':
				Stats.update(statsid,{mm:val}).exec(function (err, updated) {
   					if(err) return res.serverError(err);
   					Stats.publishUpdate(statsid,{mm:val});
   				});
			break;
			case 'sm':
				Stats.update(statsid,{sm:val}).exec(function (err, updated) {
   					if(err) return res.serverError(err);
   					Stats.publishUpdate(statsid,{sm:val});
   				});
			break;
			default:
		}
   			
   			return res.redirect('/editstats');
   },

   listPlayersForGm: function (req,res) {
	   	Player.find().populate('currentstats').exec(function (err,players) { //will need a game filter {game:req.session.game.id}
	         if(err){return res.serverError(err);}
	         res.view('editstat',{players:players});
	      });
   }
};

