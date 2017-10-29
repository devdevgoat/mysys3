

function addGame(data) {
	let html = 
	  '<div class="row">\
        <div class="col-sm-4"><a href="#" class=""><img src="<%=data.potentialdata.img%>" class="img-responsive"></a>\
        </div>\
        <div class="col-sm-8">\
          <h3 class="title"><%=data.potentialdata.title%></h3>';
          if(data.potentialdata.type == 'private') {
             html += '<p class="text-muted"><span class="glyphicon glyphicon-lock"></span> Private Game! <a href=#>Request an invite here</a></p>';
          }

          html+= '<p>'+data.potentialdata.about+'</p>';
          if(data.potentialdata.streamlink){
          	html+='<p>Spectator Link: <a href="'+data.potentialdata.streamlink+'"</p>';
          }
          html +=
          	'<a href="#" onclick="selectGame(\''+data.potentialdata.id+'\',\''+potentialplayer.id+'\')" class="btn btn-primary">Choose Player</a>\
          <p class="text-muted">GM\'d By the amazing <a href="#">'+data.potentialdata.gm.name+'</a></p>\
        </div>\
      </div>\
      <hr>';

	$(html).prependTo('#gamefeed').hide().slideDown();
}


function selectGame(playerId,gameId) {
	window.location='/game/'+gameId+'/charactersheet/'+playerId;
}
/*
 io.socket.on('connect', function(){
	io.socket.get('/game', function(resData, jwres) { //plug in options here
		$.each(resData, function (key,data) {
			addGame(data);
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
/*
io.socket.on('notification', function (event) {
		addGame(event.data.name,event.data.about,event.data.id);
});
*/