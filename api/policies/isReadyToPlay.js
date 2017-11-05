module.exports = function(req, res, next) {
  	if(req.param('playerId')){
		sails.log('Received playerId looking up player');
  		Player.findOne(req.param('playerId')).populate('currentstats').exec(function (err, player) {
			if(err){return res.serverError(err);} 
			if(!player){ //player exists right?
				sails.log('couldn\'t find player ' + req.param('playerId'));
				return res.redirect('/createplayer'); 
			}
			req.session.player = player;
			console.log('user selected player:');
			console.log(req.session.player);
			return next();
		});
  	}
    else{
    	sails.log('No player in session and no id provided, redirecting to readyplayer1. Dumping session');
		console.log(req.session);
		res.redirect('/readyplayer1');
    }
};