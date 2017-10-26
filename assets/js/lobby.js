

function addGame(name,about,id,img) {
	let html = 
	  '<div class="card" style="width: 20rem;">\
	    <img class="card-img-top" src="images/'+ img +'" alt="Card image cap">\
	    <div class="card-body">\
	      <h4 class="card-title">'+ name +'</h4>\
	      <p class="card-text">'+ about +'</p>\
	      <a href="#" onclick="selectGame("'+id +'")" class="btn btn-primary">Join</a>\
	    </div>\
	  </div>';

	$(html).prependTo('#gameList').hide().slideDown();
}

var options = {
	params : {
			'minLvl': {
				">=": ''//need to pass this from server...
			}
	}
};

 io.socket.on('connect', function(){
	io.socket.get('/game', function(resData, jwres) { //plug in options here
		alert(JSON.stringify(resData));
		$.each(resData, function (k,v) {
			addGame(v.title,v.about,v.id,v.img,v.players.length);
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
io.socket.on('notigamefication', function (event) {
		addGame(event.data.name,event.data.about,event.data.id);
});