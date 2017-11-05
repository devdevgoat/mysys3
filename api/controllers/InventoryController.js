/**
 * InventoryController
 *
 * @description :: Server-side logic for managing inventories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	addToInventory: function (req, res) {
		let itemId = req.param('itemId');
		let playerId = req.param('playerId');
		console.log(req.allParams());
		Player.findOne(playerId).populate('inventory').exec(function (err, player) {
			console.log();
			Inventory.findOne(player.inventory[0].id).exec(function (err,inv) {
				console.log(inv);
				inv.item.add(itemId);
				inv.save();
				//have to lookup the item to send it to the player
				Item.findOne(itemId).exec(function (err, item) {
					Inventory.publishAdd(inv.id,'item',item);
				});
				
				return res.redirect('/giveitem');
			});
		})
		
	}

};

