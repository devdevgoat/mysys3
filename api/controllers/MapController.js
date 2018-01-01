/**
 * MapController
 *
 * @description :: Server-side logic for managing maps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    createMap: function (req, res) {
		let gameId = (typeof req.param('gameId') === 'undefined') ? '59f6350a7272ba8104caef4b' : req.param('gameId');
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
                                //set the active map to game
                                Game.update(gameId,{activemap:newmap.id}).exec(function(err, result){
                                    if (err) {return res.negotiate(err);}
                                    //set the active map to game
                                        return res.redirect('/gm/'+gameId);
                                    }); 
                                }); 
                            });
                            
					});
			});

    },
    
    assignActive: function (req,res) {
        let mapId =  (typeof req.param('mapId') === 'undefined') ? null : req.param('mapId');
        let pageId =  (typeof req.param('pageId') === 'undefined') ? null : req.param('pageId');
            Map.update(mapId,{activepage:pageId}).exec(function(err, result){
            if (err) {return res.negotiate(err);}
                console.log('New active page:'+pageId +' set for map:'+mapId);
                Map.findOne(mapId).populate('activepage').exec(function(err, map){
                if (err) {return res.negotiate(err);}
				    Map.publishUpdate(mapId,map);
                    return res.send(map.activepage);
                });
            });
    }
};

