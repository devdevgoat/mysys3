/*
	Subscription init blocks
	Some have delta logic of <1 hour to insure
	we don't loose information when we disconnect

*/
//{"updatedAt": {">":"2016-01-01T00:00:00.000Z"}



// JavaScript Document
 function createNotificaiton(text) {
    var html = '<div class="notification" style="display:none"><h2>'+ text +'</h2></div>';
        $(html).prependTo('#newsfeed').hide().slideDown();
    } 

  io.socket.on('notification', function (data) {
    alert('got data:' + JSON.stringify(data));
    createNotificaiton(data.data.text);
  });

  io.socket.get('/notification?limit=1', function gotResponse(body, response) {
      //createNotificaiton(data.text);
      console.log(body);
      console.log(response);
  });
