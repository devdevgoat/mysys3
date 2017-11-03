//step 8: http://iliketomatoes.com/implement-passport-js-authentication-with-sails-js-0-10-2/
module.exports = function(req, res, next) {
   if (req.isAuthenticated && req.session.user) {
   		console.log('player is authenticated');
        return next();
    }
    else{
        return res.redirect('/login');
    }
};