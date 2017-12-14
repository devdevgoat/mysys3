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
		
		Stats.findOne(statsid).populate('player').exec(function (err, currStats) {
			if (err) return res.serverError(err);
			updateTo[stat] =parseInt(currStats[stat]) + parseInt(val);
			Stats.update(statsid, updateTo).exec(function (err, updated) {
				if (err) return res.serverError(err);
			});
		});
		return res.redirect('/editstats');
   },

   //c2c stats adjustment
   updateStatsAuto: function (statsid, action,stat, val) {
	stat = stat.toLowerCase();
	action = action.toLowerCase();

		 Stats.findOne(statsid).populate('player').exec(function (err, currStats) {
			 console.log(currStats);
		 	if (err) return res.serverError(err);
		 	//let newVal = parseInt(currStats[stat]) + parseInt(val);
			//let updateTo = {};
			 //updateTo[stat] = newVal.toString();
			 if(action =='inflict'){
				sails.controllers.stats.calculateDamage(currStats,stat,val, function (err, updateTo,summary) {
					console.log('Updating with:'); 
					console.log(updateTo);
					Stats.update(statsid, updateTo).exec(function (err, updated) {
						if (err) return res.serverError(err);
						if(summary!='dead'){
							Notification.create({game:currStats.player.game,text:currStats.player.name+summary}).exec(function (err,records) {
							if (err) { return res.serverError(err); }
							});
						} else {
							sails.controllers.player.killPlayer(currStats.player);
						}
					});
				}); 
			 } else {
				 let updateToSimple = {};
				 let summary = ' recovered ' + val + stat;
				 updateToSimple[stat] = currStats[stat] + val;
				Stats.update(statsid, updateToSimple).exec(function (err, updated) {
					if (err) return res.serverError(err);
						Notification.create({game:currStats.player.game,text:currStats.player.name+summary}).exec(function (err,records) {
							if (err) { return res.serverError(err); }
							});
					});
			 }
			
			
			
			
		});
   },

   listPlayersForGm: function (req,res) {
		   Player.find().populate('currentstats').exec(function (err,players) { //will need a game filter {game:req.session.game.id}
	         if(err){return res.serverError(err);}
	         res.view('editstat',{players:players});
	      });
   },
   //calculate damage should only be called when 
   //we know there is damage to be applied
   //i.e, aggressive spells/items and weapon attacks
   //thus val will come in as POSTIVE in order to simplify math
   //should perform all stat updates
   calculateDamage: function (currStats, targetStat, val, callback) {
	let updateTo = {};
	let targetModifier = targetStat.replace('e','m');
	let summary = '';
	if(currStats[targetModifier]>=val){
		summary = ' is not affected.';
	} else {
		val = parseInt(val) - parseInt(currStats[targetModifier]); //deduct the armor value
		if(currStats[targetStat]> val){
			//reduce energy
			updateTo[targetStat] = parseInt(currStats[targetStat]) - parseInt(val);
			summary = ' flinches, but takes no damage.';
		} else {
			val = val - currStats[targetStat];//reduce by energy
			updateTo[targetStat] = 0;//zero out energy
			if(currStats['le']>val){
				updateTo['le'] = parseInt(currStats['le']) - parseInt(val); //deduct le
				summary = ' is wounded.';
				if(parseInt(currStats['le'])<5){
					summary = ' doubles over in pain.'
				}
			} else {
				//dead
				summary = 'dead';
			}
		}
	}
	callback(null,updateTo,summary);
   }
};

