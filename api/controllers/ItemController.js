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

  }
};

