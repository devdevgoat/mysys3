/**
 * PagesController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	appendLines: function (req, res){

        let pageId = (typeof req.param('id') === 'undefined') ? '' : req.param('id');
        let lines = (typeof req.param('lines') === 'undefined') ? [] : req.param('lines');
        let newArr = [];
        Pages.findOne(pageId).exec(function(err, result){
          if (err) {sails.error('Error on Pages BeforeUpdate lookup:'+err);}
          let oldLines = result.lines ? result.lines : [];
          oldLines.push(lines);
          Pages.update(result.id,{lines:oldLines}).exec(function(err, updated){
            if (err) {return res.negotiate(err);}
            Pages.publishUpdate(result.id, lines);
          });
          return res.ok();
        });
    },

    createpage: function (req, res) {
		let gameId = (typeof req.param('gameId') === 'undefined') ? '59f6350a7272ba8104caef4b' : req.param('gameId');
		let mapId = (typeof req.param('mapId') === 'undefined') ? '59f6350a7272ba8104caef4b' : req.param('mapId');
        let pagename = (typeof req.param('pagename') === 'undefined') ? 'New Page' : req.param('pagename');
    		req.file('image').upload({
			  dirname: require('path').resolve(sails.config.appPath, 'assets/images/mapimages/')
			},function (err, uploadedFiles) {
			  	if (err) {return res.negotiate(err);}
			  	var filename= '';
				  if(uploadedFiles.length != 0){ // Check the number of files uploaded.
					//account for mac/windows
					let lastSlash=(uploadedFiles[0].fd.lastIndexOf('/') === -1 ) ? uploadedFiles[0].fd.lastIndexOf('\\') : uploadedFiles[0].fd.lastIndexOf('/');
					filename ='/images/mapimages/'+ uploadedFiles[0].fd.substring(lastSlash + 1);
				} 
				Pages.create({
                    name: pagename,
                    map: mapId,
                    image:filename
					}).exec(function (err, newpage) {
                        if(err){return res.serverError(err);}
                        
        console.log('Added new page with image:'+filename);
							Pages.publishCreate(newpage);
                            return res.redirect('/gm/'+gameId);
					});
			});

    }
};

