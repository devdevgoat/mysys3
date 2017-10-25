/*
	Init Subscriptions go here, where we pull
	down all relevent existing data. For now
	we'll create vairable for datetime and 
	only get data from the last few hours
*/

//get the last few notifications. 
//	To do, need to add delta flag
io.socket.get('/notification', function(resData, jwres) {
	$.each(resData, function (k,v) {
		//alert(k+':'+v.text);
		addNotification(v.text);
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

function addPartyMembert(partyMember) {
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

$(document).ready(function() {

});
