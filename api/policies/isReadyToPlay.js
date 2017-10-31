module.exports = function(req, res, next) {
  
	if(!req.session.user){
		sails.log('No user id in session, need to log in');
		return res.redirect('/login');
		//return next
	}
    else{
        return res.redirect('/login');
    }
};