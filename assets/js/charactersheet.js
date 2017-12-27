

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

   function applyPartyMemberAilmentOverlay(statsId,ail) {
	   let color;
	switch (ail) {
		case  'dead': 	color = 'gray';
			break;
		case  'frozen': color = 'lightblue';
			break;
		case  'blind': 	color = 'darkgray';
            break;
        case '': 		color = '';
		default:
			break;
	}
	$( "[id='"+statsId+"']" ).css("background-color", color);
   }

   function applyAilmentOverlay(ail) {
	$("[id$='-overlay']").remove();
	let html = '';
	switch (ail) {
		case  'dead':
		html = '<div id="'+ail+'-overlay"> <div id="'+ail+'-alert">\
		You Are Dead! ☠️\
		</div></div>';
			break;
		case  'frozen':
		html='<div id="'+ail+'-overlay"> <div id="'+ail+'-alert">\
		You are frozen! ☃️\
		</div></div>';
			break;
		case  'blind':
		html = '<div id="'+ail+'-overlay"> <div id="'+ail+'-alert">\
		You are blind! 🚫🔦\
		</div></div>';
			break;
		html = '';
		default:
			break;
	}
	$("body").append(html);
   }

   function removeAilmentOverlay(ail){
	   $('#'+ail+'-overlay').remove();
   }

 io.socket.on('connect', function(){

		io.socket.get('/player/'+playerId, function(resData, jwres) {
			if(resData.state=='dead'){
				applyAilmentOverlay(resData.state);
			}
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
				le: parseInt(stats.le),
				gold:stats.gold,
				ail:stats.ail,
				id: stats.id
			}
			updateStat(statData);
			
			io.socket.get('/inventory/'+inventoryId, function(invData, inJwres) {
				let items = invData.item;
				$.each(items, function (k,v) {
					addItem(v);
				});
			});
		});
		

		io.socket.get('/game/'+gameId+'?notifications?sort=createdAt%20ASC', function(resData, jwres) {
			let players = resData.players;
			let notifications = resData.notifications;
			//get active mapId
			let mapId = resData.activemap;
			//get pages
			/*
			io.socket.get('/map/'+mapId+'/pages', function (resData, jwres) {
				let pages = resData;
				let html = '';
				$('#pages').html(html);
				$.each(pages, function (k, v) {
					if(k==0){
						pageId = v.id;
						init(document.getElementById('map-gm'),v.image, 400, 400, 'rgba(0,0,0,.5)',v.lines);
					}
					let html = '<option value="'+v.id+'">'+v.name+'</option>';
					$(html).prependTo('#pages');
				});
			});*/
			
			$.each(players, function (k,v) {
				if(v.id!=playerId){
						addPlayer(v);
				}
			});
			$.each(notifications, function (k,v) {
				addNotification(v.id,v.text);
			});
		});

		


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
	if(event.id == inventoryId){
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
					removePartyMember(event.removedId);
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
{"verb":"updated","data":{"pe":"32"},"id":"59fe6720ce5ea5d02791ae43"}
*/

io.socket.on('stats', function (event) {
	if (event.verb == 'updated') {
		updateStat(event.data);
	}
});

io.socket.on('pages', function (event) {
	alert(JSON.stringify(event));
	if (event.verb == 'updated') {
		//just need these (and the custom fillCircle) to run on receive
		for (const i in event.data) {
				alert(event.data[i]);
				// const element = event.data[i];
				// let x = e.pageX - this.offsetLeft-(1690);
				// let y = e.pageY - this.offsetTop;
		}
		let x = e.pageX - this.offsetLeft-(1690);
		let y = e.pageY - this.offsetTop;
		ctx.globalCompositeOperation = 'destination-out';
		ctx.fillCircle(x, y, 30, '#ff0000');
		console.log('{x:'+e.pageX+'/y:'+e.pageY+'}[x2:'+x+'/y2:'+y+']');

	}
});



}); //end on connect


/*

Html Builders

*/

function addNotification(id, text) {
	let html = '<div class="notification"><h2 id='+id+'>'+ text +'</h2></div>';
	$(html).prependTo('#newsfeed').hide().slideDown();
}

function addPlayer(player) {
	io.socket.get('/player/' + player.id, function (resData, jwres) {
       let stats = resData.currentstats[0];
        let inventoryId = resData.inventory[0].id;
        let statData = {
            le: parseInt(stats.le),
            ail:stats.ail
        };
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
			<progress id="'+stats.id+'" value="'+statData.le+'" max="100"></progress>\
			<span id='+stats.id+'>'+statData.le+'</span>/'+player.le+'\
		</div>\
		</div> \
		</div>';
		$(html).prependTo('#players-section').hide().slideDown();
		applyPartyMemberAilmentOverlay(player.id,statData.ail);
	}
});//end socketgetplayer
}



function addItem(item) {
	//type eqi or item
	let classType = item.type;
	let div = '';
	let badge = '<p>+'+item.amount+''+item.target+'</p>';
	switch (item.type) {
		case 'equipment':
			div = 'equipment';
			break;
		case 'item':
			div = 'items';
			break;
		case 'spell':
			div = 'spells';
			badge = '<p>'+item.action+' '+item.ailment+'</p>';
			break;
		default:
			break;
	}
	let html = 
			'<div id="'+item.id+'" class="'+classType+'-strip">\
			<div class="info">\
			<div class="badge badge-default">'
			+badge+
			'</div></div>\
              <div  id="'+item.id+'"  class="details" draggable="true" ondragstart="dragstart_handler(event);">\
                <h3 id="'+item.id+'" >'+item.name+'</h3>'+
				'<div class=remove onclick="drop(\''+item.id+'\');"\
				\');">x</div>\
              </div>\
            </div>';
    $(html).appendTo('#'+div).hide().slideDown();
}

function removeItem(itemId) {
	$('#'+itemId).slideUp();
}
function removePartyMember(playerId) {
	$('#'+playerId).fadeOut();
}

function updateStat(data) {
	$.each(data, function (k,v) {
		if(data.id == statsId){
			//update my stats
			if(k!='ail'){
				if(k=='le'){
					$("[id="+data.id+"]").val(v);
				} else {
					$("[id="+k+"]").html(v);
				}
				
			} else {
				applyAilmentOverlay(v);
			}
		} else {
			//update member stats
			if(k!='ail'){
				if(k=='le'){
					$("[id="+data.id+"]").val(v);
				}
			} else {
				applyPartyMemberAilmentOverlay(data.playerId,v);
			}
		}
	} );
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
		//alert(JSON.stringify(resData));
	});
}


$(document).ready(function() {

});

