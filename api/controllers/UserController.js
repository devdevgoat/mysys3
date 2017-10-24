/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	signup: function (req, res) {
		sails.log('got post',req);
    	User.create({
    		firstname: req.param('firstname'),
    		lastname: req.param('lastname'),
    		email: req.param('email'),
    		password: req.param('password')
    	}).exec(function (err, newuser) {
    		if(err){
    			return res.serverError(err);
    		}
    		sails.log('New player create with id',newuser.id);
    		newuser.save();
    		return res.redirect('/lobby');
    	});
    }
};

