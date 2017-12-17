module.exports = function(req, res, next) {
  	if(req.param('playerId')){
  		Player.findOne(req.param('playerId')).populate('currentstats').exec(function (err, player) {
			if(err){return res.serverError(err);} 
			if(!player){ //player exists right?
				return res.redirect('/createplayer'); 
			}
			req.session.player = player;
			return next();
		});
  	}
    else{
		res.redirect('/readyplayer1');
    }
};