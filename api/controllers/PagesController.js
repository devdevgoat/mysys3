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
        console.log('starting update...');
        let newArr = [];
        Pages.findOne(pageId).exec(function(err, result){
          if (err) {sails.error('Error on Pages BeforeUpdate lookup:'+err);}
          let oldLines = result.lines ? result.lines : [];
          oldLines.push(lines);
          Pages.update(pageId,{lines:oldLines}).exec(function(err, result){
            if (err) {return res.negotiate(err);}
            Pages.publishUpdate(result.id, lines);
          });
          return res.ok();
        });
    }
};

