exports.register = function (server, options, next) {

server.route([
  {
    method: 'GET',
    path: '/googleauth',
    handler: function(request, reply){
      reply('You have logged in with Google');
    }

  }

  ]);

  function custom_handler(request, reply, tokens, profile) {
  // save the profile as a session so you can personalize their experience of your app
  // use the reply() to send a response/view to the visitor
  }

  return next();
};

exports.register.attributes = {
  name: 'Googleauth'
};
