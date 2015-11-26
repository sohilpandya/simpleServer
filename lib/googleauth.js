exports.register = function (server, options, next) {

server.route([
  {
    method: 'GET',
    path: '/googleauth',
    config: {
      description: 'authenticated to google',
        handler: custom_handler
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
  name: 'Home'
};
