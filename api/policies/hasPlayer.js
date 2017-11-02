module.exports = function(req, res, next) {
  req.session.gameId = req.param('gameId');
	if(req.session.user){
		if(req.session.player){
			return next;
		} else {
			return res.redirect('/readyplayer1');
		}
	}
    else{
        return res.redirect('/login');
    }
};