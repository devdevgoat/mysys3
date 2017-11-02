module.exports = function(req, res, next) {
  
	if(!req.session.player){
		sails.log('No player selected, redirecting to readyplayer1.');
		return res.redirect('/readyplayer1');
		//return next()
	}
    else{
    	console.log('HAS PLAYER! -isReadyToPlay');
        return next();
    }
};