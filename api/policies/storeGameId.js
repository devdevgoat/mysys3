module.exports = function(req, res, next) {
	if(req.param('gameId')){
		req.session.gameId=req.param('gameId');
		console.log('Storing game id '+req.param('gameId')+' waiting for player selection');
		return next();
	} else {
		return res.redirect('/');
	}
};