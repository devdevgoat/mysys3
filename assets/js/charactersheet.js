

let hoursBack = 2;
var d = new Date();
d.setHours(d.getHours() - hoursBack);
let dFormated = '"' + d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() + //month starts a 0 bc stupid
				'T' + ("0" + d.getHours()).slice(-2) + ':' + d.getMinutes() + ':' + d.getSeconds() + '.' + d.getMilliseconds	() + 'Z"';

let sub = {
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
		$.each(players, function (k,v) {
			if(v.id!=playerId){
				addPartyMember(v);
			}
		});
		$.each(notifications, function (k,v) {
			addNotification(v.text);
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

io.socket.on('player', function (event) {
	if(event.verb == 'updated'){
		if (event.attribute == 'currentstats') {
			switch (updated) {
			    case 'pe':
			      updateStat('0',updated.pe);
			      break;
			    case 'me':
			      updateStat('1',updated.me);
			      break;
			    case 'se':
			      updateStat('2',updated.se);
			      break;
			    default:
			      console.warn('Unrecognized socket event (`%s`) from server:',event.verb, event);
			  }
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

function updateStat(stat,value) {
	  // var dps = chart.options.data[0].dataPoints;
	  // for (var i = 0; i < newDataPoints.length; i++) {
	  //   boilerColor = newDataPoints[i].y < 10 ? "#FF2500" : newDataPoints[i].y <= 65 ? "#FF6000" : newDataPoints[i].y > 65 ? "#6B8E23 " : null;
	  //   dps[i] = {label: newDataPoints[i].label , y: newDataPoints[i].y, color: boilerColor};
	  // }
	  // chart.options.data[0].dataPoints = dps; 

	// let barColor = value < 10 ? "#FF2500" : value <= 65 ? "#FF6000" : value > 65 ? "#6B8E23" : null;
	// let dataPoint = {label: stat , y: value, color: barColor};
	var data = chart.options.data[0].dataPoints[0];
	data.lable[stat].y = value; 
	data.lable[stat].color = barColor; 
  	chart.render();
}



$(document).ready(function() {

});
