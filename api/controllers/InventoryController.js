/**
 * InventoryController
 *
 * @description :: Server-side logic for managing inventories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	addToInventory: function (req, res) {
		let itemId = req.param('itemid');
		let playerId = req.param('playerid');
		Player.find(player).populate('inventory').exec(function (err, player) {
			player.inventory.add(itemId);
		})
		
	}

};

