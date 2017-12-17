/**
 * InventoryController
 *
 * @description :: Server-side logic for managing inventories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	//add via gm panel/html
	addToInventory: function (req, res) {
		let itemId = req.param('itemId');
		let playerId = req.param('playerId');
		Player.findOne(playerId).populate('inventory').populate('currentstats').exec(function (err, player) {
			Inventory.findOne(player.inventory[0].id).exec(function (err,inv) {
				inv.item.add(itemId);
				inv.save();
				//have to lookup the item to send it to the player
				Item.findOne(itemId).exec(function (err, item) {
					//tacking on player info to item for gm purposes
					item['player'] = player;
					//if equipment, add the modifier to the stats
					if(item.type =='equipment'){
						let updateTo = {};
						let stat = item.target.toLowerCase().replace('e','m'); 
						updateTo[stat] = parseInt(player.currentstats[0][stat]) + parseInt(item.amount);
						Stats.update(player.currentstats[0].id,updateTo).exec(function (err, updated) {
							console.log('Player stats increased by '+parseInt(item.amount));
						});
					}
					Inventory.publishAdd(inv.id,'item',item);
				});
				//return res.redirect('/giveitem');
				return res.ok();
			});
		})
		
	},

	autoAddToInventory: function (itemId, playerId) {
		Player.findOne(playerId).populate('inventory').populate('currentstats').exec(function (err, player) {
			Inventory.findOne(player.inventory[0].id).exec(function (err,inv) {
				inv.item.add(itemId);
				inv.save();
				//have to lookup the item to send it to the player
				Item.findOne(itemId).exec(function (err, item) {
					//tacking on player info to item for gm purposes
					item['player'] = player;
					//if equipment, add the modifier to the stats
					if(item.type =='equipment'){
						let updateTo = {};
						let stat = item.target.toLowerCase().replace('e','m'); 
						updateTo[stat] = parseInt(player.currentstats[0][stat]) + parseInt(item.amount);
						Stats.update(player.currentstats[0].id,updateTo).exec(function (err, updated) {
							console.log('Player stats increased by '+parseInt(item.amount));
						});
					}
					Inventory.publishAdd(inv.id,'item',item);
				});
			});
		})
		
	},

	dropFromInventory: function (req, res) {
		let itemId = req.param('itemId');
		let playerId = req.param('playerId');
		let location = '0.0';
		Player.findOne(playerId).populate('inventory').populate('currentstats').exec(function (err, player) {
			Inventory.findOne(player.inventory[0].id).exec(function (err,inv) {
				inv.item.remove(itemId);
				Inventory.publishRemove(inv.id,'item',itemId);
				inv.save();
				//have to lookup the item to send it to the player
				Item.findOne(itemId).exec(function (err, item) {
					//remove any equipment modifiers
					if(item.type =='equipment'){
						let updateTo = {};
						let stat = item.target.toLowerCase();
						updateTo[stat] = parseInt(player.currentstats[0][stat]) - parseInt(item.amount);
						Stats.update(player.currentstats[0].id,updateTo).exec(function (err, updated) {
							console.log('Player stats reduced by '+parseInt(item.amount));
						});
					}
					let dropKey = Math.random().toString(36).substr(2, 15);
					let dropNote = {
						game: player.game,
						text: player.name + ' dropped <a onclick="pickup(this.parentNode.id,\''+dropKey+'\')">' + item.name + '</a>'
					};
					let addToThePile = {
							game:		player.game,
							location: '0.0',
							itemId: 	itemId,
							dropKey: 	dropKey
					};

					Stuff.create(addToThePile).exec(function (err,created) {
						if (err) { return res.serverError(err); }
						Notification.create(dropNote).exec(function (err,records) {
							if (err) { return res.serverError(err); }

							return res.ok();
						});
					});
						
				});
				
			});
		})
		
	},

	//drop from inventory programatically
	autoDrop: function (itemId, playerId, location) {
		Player.findOne(playerId).populate('inventory').populate('currentstats').exec(function (err, player) {
			Inventory.findOne(player.inventory[0].id).exec(function (err,inv) {
				inv.item.remove(itemId);
				Inventory.publishRemove(inv.id,'item',itemId);
				inv.save();
				//have to lookup the item to send it to the player
				Item.findOne(itemId).exec(function (err, item) {
					//remove any equipment modifiers
					if(item.type =='equipment'){
						let updateTo = {};
						let stat = item.target.toLowerCase();
						updateTo[stat] = parseInt(player.currentstats[0][stat]) - parseInt(item.amount);
						Stats.update(player.currentstats[0].id,updateTo).exec(function (err, updated) {
							console.log('Player stats reduced by '+parseInt(item.amount));
						});
					}
					let dropKey = Math.random().toString(36).substr(2, 15);
					let dropNote = {
						game: player.game,
						text: player.name + ' dropped <a onclick="pickup(this.parentNode.id,\''+dropKey+'\')">' + item.name + '</a>'
					};
					let addToThePile = {
							game:		player.game,
							location: '0.0',
							itemId: 	itemId,
							dropKey: 	dropKey
					};

					Stuff.create(addToThePile).exec(function (err,created) {
						if (err) { return res.serverError(err); }
						Notification.create(dropNote).exec(function (err,records) {
							if (err) { return res.serverError(err); }
						});
					});
						
				});
				
			});
		})
		
	}

};

