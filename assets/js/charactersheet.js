

/*let hoursBack = 2;
var d = new Date();
d.setHours(d.getHours() - hoursBack);
let dFormated = '"' + d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() + //month starts a 0 bc stupid
				'T' + ("0" + d.getHours()).slice(-2) + ':' + d.getMinutes() + ':' + d.getSeconds() + '.' + d.getMilliseconds	() + 'Z"';
*/
/*
	Init Subscriptions go here, where we pull
	down all relevent existing data. For now
	we'll create vairable for datetime and 
	only get data from the last few hours
*/

function dragstart_handler(ev) {
	console.log("dragStart");
	// Add the target element's id to the data transfer object
	ev.dataTransfer.setData("text/plain", ev.target.id);
   }

function dragover_handler(ev) {
	ev.preventDefault();
	// Set the dropEffect to move

	//is this where I can chagne the on hover style?
	//if so, I could get the immediate siblings on either side for multi targets
	ev.dataTransfer.dropEffect = "move";
   }
function drop_handler(ev) {
	ev.preventDefault();
	// Get the id of the target and add the moved element to the target's DOM
	var item = ev.dataTransfer.getData("text");
	//alert('Used '+item+' on '+ev.target.id);
	data = {
		gameId: gameId,
		playerId: playerId,
		itemId: item,
		inventoryId: inventoryId,
		targets: ev.target.id
	};
	
	io.socket.post('/useItem',data,function (resData,jwres) {

	});
	//alert(JSON.stringify(data));
   }

 io.socket.on('connect', function(){

		io.socket.get('/player/'+playerId, function(resData, jwres) {
			/*{"inventory":
				[{"player":"59fe6720ce5ea5d02791ae42","createdAt":"2017-11-05T01:19:28.114Z","updatedAt":"2017-11-05T01:21:06.651Z","id":"59fe6720ce5ea5d02791ae44"}],
			"currentstats":
				[{"player":"59fe6720ce5ea5d02791ae42","pe":"32","se":"11","me":"12","pm":"0","mm":"0","sm":"0","le":"100", "createdAt":"2017-11-05T01:19:28.112Z","updatedAt":"2017-11-07T01:35:48.999Z","id":"59fe6720ce5ea5d02791ae43"}],
			"user":
				{"firstname":"Russell","lastname":"Lamb","email":"russell.w.lamb@gmail.com","createdAt":"2017-11-04T14:39:37.799Z","updatedAt":"2017-11-04T14:39:37.813Z","id":"59fdd1299aee4e031e61f91e"},
			"game":
				{"title":"hive mind","about":"get to work","image":"#","gm":"59feea65ce5ea5d02791ae46","minlvl":"1","createdAt":"2017-11-05T10:40:19.762Z","updatedAt":"2017-11-07T01:36:24.931Z","id":"59feea93ce5ea5d02791ae4a"},
			"name":"yuyu","backstory":"888","maxpe":8,"maxme":8,"maxse":8,"image":"/images/playerimgs/16660b27-e9c4-4215-9544-89c2e74fb2ce.JPG","lvl":"1","le":100,"createdAt":"2017-11-05T01:19:28.108Z","updatedAt":"2017-11-07T01:36:24.935Z","id":"59fe6720ce5ea5d02791ae42"}*/
			let stats = resData.currentstats[0];
			inventoryId = resData.inventory[0].id;
			//let inventory = resData.inventory[0];
			
			let statData = {
				pe: parseInt(stats.pe) + parseInt(stats.pm),
				me: parseInt(stats.me) + parseInt(stats.mm),
				se: parseInt(stats.se) + parseInt(stats.sm),
				le: parseInt(stats.le)
			}
			updateStat(statData);
			
			io.socket.get('/inventory/'+inventoryId, function(invData, inJwres) {
				let items = invData.item;
				$.each(items, function (k,v) {
					addItem(v);
				});
			});
		});
		

		io.socket.get('/game/'+gameId, function(resData, jwres) {
			let players = resData.players;
			let notifications = resData.notifications;
			$.each(players, function (k,v) {
				if(v.id!=playerId){
						addPlayer(v);
				}
			});
			$.each(notifications, function (k,v) {
				addNotification(v.id,v.text);
			});
		});
  }); //end on connect



/*	
	Event listeners, this gets our new/changed data
	data coming looks like this: 
		{"verb":"created",
		"data":{"text":"My 3 notifcation", / added
		"createdAt":"2017-10-24T23:58:24.815Z",
		"updatedAt":"2017-10-24T23:58:24.815Z",
		"id":"59efd3a0fa1cbbc8032a307f"},
		"id":"59efd3a0fa1cbbc8032a307f"}
*/
io.socket.on('notification', function (event) {//not sure why this is working
	//don't forget to replace the blast for link removal with direct update by game room
		switch(event.verb){
			case 'updated':
				$('#'+event.id).html(event.data.text);
			break;
			case 'destroyed':
				$('#'+event.id).parent().slideUp().remove();
			break;
			default:
		}
});

io.socket.on('inventory', function (event) {
	console.log(event);
	switch (event.verb) {
		case 'addedTo':
			addItem(event.added);
		  break;
		case 'removedFrom':
			removeItem(event.removedId);
		break;
		default:
		  console.warn('Unrecognized socket event (`%s`) from server:',event.verb, event);
	  }
		
});
/*
{"verb":"updated","data":{"pe":"32"},"id":"59fe6720ce5ea5d02791ae43"}
*/
io.socket.on('stats', function (event) {
	if(event.verb == 'updated'){
		updateStat(event.data);
	}
});


io.socket.on('game', function (event) { //need to decifer between player adds and notifications?
	// {"id":"59fdd1439aee4e031e61f91f",
	// "verb":"addedTo",
	//"attribute" :"notifications",
	// "addedId":"59fef31ba264a60e2a88e5c1",
	// "added":{"game":"59fdd1439aee4e031e61f91f",
	// "text":"Finn woke up2000",
	// "createdAt":"2017-11-05T11:16:43.488Z",
	// "updatedAt":"2017-11-05T11:16:43.488Z",
	// "id":"59fef31ba264a60e2a88e5c1"}}
	switch (event.verb) {
		case 'addedTo':
			switch (event.attribute) {
				case 'notifications':
					addNotification(event.addedId,event.added.text);
				break;
				case 'players':
					addPlayer(event.added);
				break;
				default:
				console.warn('Unrecognized socket event (`%s`) from server:',event.verb, event);
			}
		  break;
		case 'removedFrom':
			switch (event.attribute) {
				case 'notifications':
					//addNotification(event.added.text);
				break;
				case 'players':
					//addPartyMember(event.added);
				break;
				default:
				console.warn('Unrecognized socket event (`%s`) from server:',event.verb, event);
			}
		break;
		default:
		  console.warn('Unrecognized socket event (`%s`) from server:',event.verb, event);
	  }
});



/*

Html Builders

*/

function addNotification(id, text) {
	let html = '<div class="notification"><h2 id='+id+'>'+ text +'</h2></div>';
	$(html).prependTo('#newsfeed').hide().slideDown();
}

function addPlayer(player) {
	
	if(player.type == 'npc'){
		let html = 
		'<div  id='+player.id+' class="card" ondrop="drop_handler(event);" ondragover="dragover_handler(event);">\
			<img  id='+player.id+' class="img-circle" src="'+player.image+'">\
			<p id='+player.id+'>'+player.name+'</p>\
		</div> ';
		$(html).appendTo('#cards');
	} else {
		let html ='<div id='+player.id+' class="strip" ondrop="drop_handler(event);" ondragover="dragover_handler(event);">\
		<img id='+player.id+' src='+ player.image +' class="img-circle">\
		<div  id='+player.id+' class="details">\
			<h3  id='+player.id+' >'+player.name+'</h3>\
			<progress id="health" value="'+player.le+'" max="100"></progress>\
		</div>\
		</div> \
		</div>';
		$(html).prependTo('#players-section').hide().slideDown();
	}
}



function addItem(item) {
	//type eqi or item
	let classType = item.type;
	let div = '';
	switch (item.type) {
		case 'equipment':
			div = 'equipment';
			break;
		case 'item':
			div = 'items';
			break;
		case 'spell':
			div = 'spells';
			break;
		default:
			break;
	}
	let html = 
			'<div id="'+item.id+'" class="'+classType+'-strip">\
              <!--<div class="'+classType+'-img">\
                <img src="/images/'+item.img+'">\
			  </div>-->\
              <div  id="'+item.id+'"  class="details" draggable="true" ondragstart="dragstart_handler(event);">\
                <h3 id="'+item.id+'" >'+item.name+'</h3>\
				<h4 id="'+item.id+'" >'+item.desc+'</h4>\
				<div class=itembutts >\
				<img src="/images/gift.svg"> <img src="/images/finger-moving-activating-an-arrow.svg"><img src="/images/recycle-bin.svg" onclick="drop(\''+item.id+'\');">\
				</div>\
              </div>\
              <div class="info">\
                <div class="badge badge-default">\
                  <p>+'+item.amount+''+item.target+'</p>\
                </div>\
            </div>';
    $(html).appendTo('#'+div).hide().slideDown();
}

function removeItem(itemId) {
	$('#'+itemId).slideUp();
}

function updateStat(data) {
	$.each(data, function (k,v) {
		if(k=="le"){
			$('#health').val(v);
		} else{
			$('#'+k).html(v);
		}
	} )
}



function drop(itemId) {
	let data = {
		itemId: itemId,
		playerId: playerId
	};
	io.socket.post('/Inventory/dropFromInventory',data,function (resData,jwres) {
		
	});
}

function pickup(noteId,dropKey) {
	let data = {
		playerId: playerId,
		gameId: gameId,
		dropKey: dropKey,
		noteId: noteId
	};
	io.socket.post('/Stuff/pickup/',data,function (resData,jwres) {
		
	});
}


$(document).ready(function() {

});
