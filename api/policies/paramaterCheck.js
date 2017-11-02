module.exports = function(req, res, next) {
	sails.log('-------------Printing Params--------------')
	console.log(req.allParams());
	return next();
};