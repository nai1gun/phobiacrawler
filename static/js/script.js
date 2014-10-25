/* Author: YOUR NAME HERE
*/

var settings = {
    email: null
};

$(document).ready(function() {   

  var socket = io.connect();

  $('#sender').bind('click', function() {
   socket.emit('message', $('#email').val());
  });

  socket.on('server_message', function(data){
   $('#receiver').append('<li>' + data + '</li>');  
  });

  $.get( "/service/settings.json", function(result) {
    settings = result;
      refreshEmail();
  });
});

function refreshEmail() {
    $('#email').val(settings.email);
}