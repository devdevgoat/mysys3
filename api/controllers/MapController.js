/**
 * MapController
 *
 * @description :: Server-side logic for managing maps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    createMap: function (req, res) {
		let gameId = (typeof req.param('gameId') === 'undefined') ? '59f6350a7272ba8104caef4b' : req.param('gameId');
        let type = (typeof req.param('type') === 'undefined') ? 'pc' : req.param('type');
    		req.file('image').upload({
			  dirname: require('path').resolve(sails.config.appPath, 'assets/images/mapimages/')
			},function (err, uploadedFiles) {
			  	if (err) {return res.negotiate(err);}
			  	var filename= 'map.png'
				  if(uploadedFiles.length != 0){ // Check the number of files uploaded.
					//account for mac/windows
					let lastSlash=(uploadedFiles[0].fd.lastIndexOf('/') === -1 ) ? uploadedFiles[0].fd.lastIndexOf('\\') : uploadedFiles[0].fd.lastIndexOf('/');
					filename = uploadedFiles[0].fd.substring(lastSlash + 1);
				} 
				Map.create({
					name: req.param('mapname'),
					game: gameId
					}).exec(function (err, newmap) {
						if(err){return res.serverError(err);}
							Map.publishCreate(newmap);
                            Map.findOne(newmap.id).populate('pages').exec(function(err, result){
                            if (err) {return res.negotiate(err);}
                            console.log('Found new map:');
                            console.log(result);
                                Pages.update(result.pages.id,{image:'/images/mapimages/'+filename}).exec(function(err, result){
                                if (err) {return res.negotiate(err);}
                                    return res.redirect('/gm/'+gameId);
                                }); 
                            });
                            
					});
			});

	},
};

