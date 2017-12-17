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
			if(stat == 'ail'){
				updateTo[stat] = val;
			} else {
				updateTo[stat] =parseInt(currStats[stat]) + parseInt(val);
			}
			
			Stats.update(statsid, updateTo).exec(function (err, updated) {
				if (err) return res.serverError(err);
			});

			return res.ok(currStats);
		});
		//return res.redirect('/editstats');
		
   },

   //c2c stats adjustment
   updateStatsAuto: function (statsid, action,stat, val) {
	stat = stat.toLowerCase();
	action = action.toLowerCase();
		 Stats.findOne(statsid).populate('player').exec(function (err, currStats) {
		 	if (err) return res.serverError(err);
			 if(action =='inflict'){
				sails.controllers.stats.calculateDamage(currStats,stat,val, function (err, updateTo,summary) {
					Stats.update(statsid, updateTo).exec(function (err, updated) {
						if (err) return res.serverError(err);
						if(summary!='dead'){
							if(summary == 'missed'){
								Notification.create({game:currStats.player.game,text:'... but missed!'}).exec(function (err,records) {
									if (err) { return res.serverError(err); }
								});
							} else {
								Notification.create({game:currStats.player.game,text:currStats.player.name+summary}).exec(function (err,records) {
									if (err) { return res.serverError(err); }
								});
							}
						} else {
							sails.controllers.player.killPlayer(currStats.player);
						}
					});
				}); 
			 } else {
				let summary = '';
				let updateToSimple = {};
				 if(stat=='ail'){
					if(currStats[stat]==val){
						summary = ' is cured of ' + val;
						updateToSimple[stat] = '';
					} else {
						summary = '...but player is not ' + val+' 0_o.';
					}

				 } else {
					 summary = ' recovered ' + parseInt(val) + stat;
					updateToSimple[stat] = parseInt(currStats[stat]) + parseInt(val);
				 }
				
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
   
	missed: function(XMa,XMd){
		if(XMd == 0){
			return false;
		}
		let rand = Math.random();
		console.log('Checking '+rand +' < '+XMa/XMd);
		return (rand < XMa/XMd ? false : true);
	},

   //calculate damage should only be called when 
   //we know there is damage to be applied
   //i.e, aggressive spells/items and weapon attacks
   //thus val will come in as POSTIVE in order to simplify math
   //should perform all stat updates
   calculateDamage: function (currStats, targetStat, val, callback) {
	let crit = (Math.random() < 0.19 ? 2 : 1);
	val = val * crit;
	if(crit>1){
		console.log('CRITICAL: '+crit);
	}
	let updateTo = {};
	let targetModifier = targetStat.replace('e','m');
	if(targetModifier=='lm'){
		console.log('Direct life attack not supported, setting to PE');
		targetModifier='pm';
		targetStat='pe';
	}
	console.log('Stat:'+targetModifier);
	console.log('actual stat:'+
	currStats[targetModifier]);
	let summary = '';
	console.log('Defender stat:'+parseInt(currStats[targetModifier]));
	console.log('Attacker stat:'+parseInt(val));
	if(sails.controllers.stats.missed(parseInt(val),parseInt(currStats[targetModifier]))){
		console.log('Missed');
		summary = 'missed';
		callback(null,'',summary);
	} else {
		// commented out because armor determines hit/miss above
		// val = parseInt(val) - parseInt(currStats[targetModifier]); //deduct the armor value
		// if (val <0){
		// 	//too much armor?
		// }
		// console.log('Reduced val by armor to ' + val);
		if(currStats[targetStat]> val){
			//reduce energy
			console.log('Defender has enough '+targetStat+ '('+currStats[targetStat]+') to absorbe the new val.');
			updateTo[targetStat] = parseInt(currStats[targetStat]) - parseInt(val);
			summary = ' flinches, but takes no damage.';
		} else {
			console.log('Defender DOESN"T have enough '+targetStat+ '('+currStats[targetStat]+') to absorbe the new val('+val+') ');
			val = parseInt(val) - parseInt(currStats[targetStat]);//reduce by energy
			console.log('New val:'+ val);
			updateTo[targetStat] = 0;//zero out energy
			if(parseInt(currStats['le'])>parseInt(val)){
				console.log('Defender has enough LE ('+currStats['le']+') to absorbe the new val('+val+')');
				updateTo['le'] = parseInt(currStats['le']) - parseInt(val); //deduct le
				summary = ' is wounded.';
				if(parseInt(updateTo['le'])<=5){
					summary += ' doubles over in pain.'
				}
			} else {
				//dead
				summary = 'dead';
			}
		}
	}
	console.log(summary);
	callback(null,updateTo,summary);
   }
};

