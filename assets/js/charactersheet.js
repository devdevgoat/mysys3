

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
alert(where);
//needs to look like this //?where={"createdAt":{">":"2017-10-25T17:29:17.669Z"}}


/*
	Init Subscriptions go here, where we pull
	down all relevent existing data. For now
	we'll create vairable for datetime and 
	only get data from the last few hours
*/

  io.socket.on('connect', function(){
	io.socket.get('/notification'+where, function(resData, jwres) {
		$.each(resData, function (k,v) {
			addNotification(v.text);
		});
	});
	io.socket.get('/player/'+playerId, function(resData, jwres) {
		var items = resData.inventory.item;
		$.each(items, function (k,v) {
			alert('has item: 'v.name)
			addItem(v);
		});
	});
  });
/*	
	Event listeners, this gets our new/changed data
	data coming looks like this: 
		{"verb":"created",
		"data":{"text":"My 3 notifcation",
		"createdAt":"2017-10-24T23:58:24.815Z",
		"updatedAt":"2017-10-24T23:58:24.815Z",
		"id":"59efd3a0fa1cbbc8032a307f"},
		"id":"59efd3a0fa1cbbc8032a307f"}
*/
io.socket.on('notification', function (event) {
		addNotification(event.data.text);
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
	              <div class="img-circle"><img src='+ partyMember.img +'></div>\
	              <div class="details">\
	              	<h3>'+partyMember.name+'</h3>\
	              	<progress id="health" value="'+partyMember.le+'" max="100"></progress>\
	              </div>\
            	</div> \
	          </div>';
	$(html).prependTo('#players-section').hide().slideDown();
}

function addItem(item,qty) {
	let html = 
			'<div class="eqi-strip">\
              <div class="eqi-img">\
                <img src="/images/'+item.img+'">\
              </div>\
              <div class="details">\
                <h3>'=item.name='</h3>\
                <h4>'+item.desc+'</h4>\
              </div>\
              <div class="info">\
                <div class="badge badge-default">\
                  <p>+'+item.amount+item.target' x'+qty+'</p>\
                </div>\
                <div class="eqi-type-img">\
                  <img src="/images/body-building.png">\
                </div>\
            </div>\
            </div>';
    $(html).prependTo('#'+item.type).hide().slideDown();
}



$(document).ready(function() {

});
