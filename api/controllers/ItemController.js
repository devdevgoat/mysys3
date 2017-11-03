/**
 * ItemController
 *
 * @description :: Server-side logic for managing items
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	  useItem: function (req,res) { 
    /*To use this function, provide the users in a array like so
    *     var targets = [1,2,3,4,5,6,7,...,200];
    *     submit({task: JSON.stringify(task)}
    */
    //using an item will result in an update to a players stats
    //to use an item you must have at least one target player
    if(!req.param("task")) return res.send(400, "Task is required.");
    var task = req.param("task");
    if(typeof task === "string"){
      try{
        task = JSON.parse(task);
      }catch(err){
        return res.send(400, "Error parsing tasks!");
      }
    }
    // task value is [1,2,3,4,5,6,7,..., 200]
    // Do stuff with task array
    var playerId = req.param('playerId');

  },
      createItem: function (req, res) {
        req.file('image').upload({
        dirname: require('path').resolve(sails.config.appPath, 'assets/images/itemimages/')
      },function (err, uploadedFiles) {
          if (err) {return res.negotiate(err);}
          if(uploadedFiles[0]){
            var filename = '/images/itemimages/'+ uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('/') + 1);
          console.log(filename);
          sails.log('**** ', uploadedFiles);
          } else {
            var filename = '#';
          }
        Item.create({
          name: req.param('name'),
          desc: req.param('desc'),
          amount: req.param('amount'),
          type: req.param('type'),
          target: req.param('target'),
          action: req.param('action'),
          image: filename
          }).exec(function (err, newgame) {
            if(err){return res.serverError(err);}
            sails.log('New item created with id',newgame.id);
            res.view('/createitem'); //should take you straigh to gm board really
          });
      });
   }
};

