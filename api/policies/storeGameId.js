module.exports = function(req, res, next) {
	if(req.param('gameId')){
		req.session.gameId=req.param('gameId');
		return next();
	} else {
		return res.redirect('/');
	}
};