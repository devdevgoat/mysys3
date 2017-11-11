

let hoursBack = 2;
var d = new Date();
d.setHours(d.getHours() - hoursBack);
let dFormated = '"' + d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() + //month starts a 0 bc stupid
				'T' + ("0" + d.getHours()).slice(-2) + ':' + d.getMinutes() + ':' + d.getSeconds() + '.' + d.getMilliseconds	() + 'Z"';

let sub = 
						{
							createdAt: {
								'>': dFormated
							},
							game: game
						}
let where = '?where='+JSON.stringify(sub);
//alert(where);
//needs to look like this //?where={"createdAt":{">":"2017-10-25T17:29:17.669Z"}}


/*
	Init Subscriptions go here, where we pull
	down all relevent existing data. For now
	we'll create vairable for datetime and 
	only get data from the last few hours
*/

 io.socket.on('connect', function(){

		io.socket.get('/player/'+playerId, function(resData, jwres) {
			/*{"inventory":[{"player":"59fe6720ce5ea5d02791ae42","createdAt":"2017-11-05T01:19:28.114Z",
			"updatedAt":"2017-11-05T01:21:06.651Z","id":"59fe6720ce5ea5d02791ae44"}],
			"currentstats":[{"player":"59fe6720ce5ea5d02791ae42","pe":"32","se":"11","me":"12","pm":"0","mm":"0","sm":"0","le":"100",
			"createdAt":"2017-11-05T01:19:28.112Z","updatedAt":"2017-11-07T01:35:48.999Z","id":"59fe6720ce5ea5d02791ae43"}],
			"user":{"firstname":"Russell","lastname":"Lamb","email":"russell.w.lamb@gmail.com",
			"createdAt":"2017-11-04T14:39:37.799Z","updatedAt":"2017-11-04T14:39:37.813Z","id":"59fdd1299aee4e031e61f91e"},
			"game":{"title":"hive mind","about":"get to work","image":"#","gm":"59feea65ce5ea5d02791ae46","minlvl":"1",
			"createdAt":"2017-11-05T10:40:19.762Z","updatedAt":"2017-11-07T01:36:24.931Z","id":"59feea93ce5ea5d02791ae4a"},
			"name":"yuyu","backstory":"888","maxpe":8,"maxme":8,"maxse":8,"image":"/images/playerimgs/16660b27-e9c4-4215-9544-89c2e74fb2ce.JPG","lvl":"1","le":100,"createdAt":"2017-11-05T01:19:28.108Z","updatedAt":"2017-11-07T01:36:24.935Z","id":"59fe6720ce5ea5d02791ae42"}*/
			let stats = resData.currentstats[0];
			let statData = {
				pe: parseInt(stats.pe) + parseInt(stats.pm),
				me: parseInt(stats.me) + parseInt(stats.mm),
				se: parseInt(stats.se) + parseInt(stats.sm)
			}

			updateStat(statData);
		});

			io.socket.get('/inventory/'+inventoryId, function(resData, jwres) {
			let items = resData.item;
			$.each(items, function (k,v) {
				addItem(v);
			});
		});

			io.socket.get('/game/'+game, function(resData, jwres) {
			let players = resData.players;
			let notifications = resData.notifications;
			let npcs = resData.npcs;
			$.each(players, function (k,v) {
				if(v.id!=playerId){
					addPartyMember(v);
				}
			});
			$.each(notifications, function (k,v) {
				addNotification(v.text);
			});
			$.each(npcs, function (k,v) {
				if(v.id!=playerId){
					addNPC(v);
				}
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
// io.socket.on('notification', function (event) {//not sure why this is working
// 		addNotification(event.data.text);
// });

io.socket.on('inventory', function (event) {
		addItem(event.added);
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

	if(event.verb == 'addedTo'){
		if (event.attribute == 'notifications') {
			addNotification(event.added.text);
	    }	 	
		if (event.attribute == 'players') {
			addPartyMember(event.added);
	    }
	}
});



/*

Html Builders

*/

function addNotification(text) {
	let html = '<div class="notification"><h2>'+ text +'</h2></div>';
	$(html).prependTo('#newsfeed').hide().slideDown();
}

function addPartyMember(partyMember) {
	let html ='<div class="strip">\
	              <img src='+ partyMember.image +' class="img-circle">\
	              <div class="details">\
	              	<h3>'+partyMember.name+'</h3>\
	              	<progress id="health" value="'+partyMember.le+'" max="100"></progress>\
	              </div>\
            	</div> \
	          </div>';
	$(html).prependTo('#players-section').hide().slideDown();
}

function addItem(item) {
	//type eqi or iteam
	let type = (item.type = 'item') ? "iteam" : "eqi";
	let div = (item.type = 'item') ? 'iteams' : 'equipments';
	let html = 
			'<div class="'+type+'-strip">\
              <div class="'+type+'-img">\
                <img src="/images/'+item.img+'">\
              </div>\
              <div class="details">\
                <h3>'+item.name+'</h3>\
                <h4>'+item.desc+'</h4>\
              </div>\
              <div class="info">\
                <div class="badge badge-default">\
                  <p>+'+item.amount+''+item.target+'</p>\
                </div>\
            </div>\
            </div>';
    $(html).appendTo('#'+div).hide().slideDown();
}

function updateStat(data) {
	$.each(data, function (k,v) {
		$('#'+k).html(v);
	} )
}

function	addNPC(npc){
	let html = 
	'<div class="card">\
		<img  src="/images/npcs/"'+npc.img+'>\
		<p>'+npc.name+'</p>\
	</div> ';
	$(html).appendTo('#cards');
}

$(document).ready(function() {

});
