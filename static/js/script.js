/* Author: YOUR NAME HERE
*/

var settings = {
    email: null,
    url: null
};

$(document).ready(function() {   

  var socket = io.connect();

  $('#save_email').bind('click', function() {
    socket.emit('email', $('#email').val());
  });

  $('#save_url').bind('click', function() {
    socket.emit('url', $('#url').val());
  });

  socket.on('server_message', function(data){
    $('#receiver').append('<li>' + data + '</li>');
  });

  $.get( "/service/settings.json", function(result) {
    settings = result;
      refreshEmail();
      refreshUrl();
  });
});

function refreshEmail() {
    $('#email').val(settings.email);
}

function refreshUrl() {
    $('#url').val(settings.url);
}