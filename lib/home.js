var JWT = require('jsonwebtoken'); // session stored as a JWT cookie

exports.register = function (server, options, next) {


  var scopes = [
    'https://www.googleapis.com/auth/plus.profile.emails.read'
  ];
  var opts = {
  REDIRECT_URL: '/googleauth',  // must match google app redirect URI
  handler: custom_handler, // your handler
  scope: scopes // profile
  };


  function custom_handler(request, reply, tokens, profile,oauth2Client) {
  // save the profile as a session so you can personalize their experience of your app
  // use the reply() to send a response/view to the visitor
  if(profile) {

    profile.tokens = tokens; // save the OAuth Token for later

      // extract the relevant data from Profile to store in JWT object
      var session = {
        fistname : profile.name.givenName, // the person's first name e.g: Anita
        image    : profile.image.url,      // profile image url
        id       : profile.id,             // google+ id
        agent    : request.headers['user-agent'],
        access_token: tokens.access_token
      };
      // create a JWT to set as the cookie:
      var token = JWT.sign(session, process.env.JWT_SECRET);
      console.log(token);
      // store the Profile and Oauth tokens in the Redis DB using G+ id as key
      // Detailed Example...? https://github.com/dwyl/hapi-auth-google/issues/2

      // reply to client with a view
      return reply("Hello " +profile.name.givenName + " You Logged in Using Google!")
      .state('token', token); // see: http://hapijs.com/tutorials/cookies
    }
    else {
      return reply("Sorry, something went wrong, please try again.");
    }
  }

  var hapi_auth_google = require('hapi-auth-google');
  var google = require('googleapis');
  var OAuth2 = google.auth.OAuth2;
  var oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, opts.REDIRECT_URL);

  // console.log(oauth2Client,"---------");


  var plugins = [
  	{ register: hapi_auth_google, options:opts },
  ];

  server.register(plugins, function (err) {
  // handle the error if the plugin failed to load:
  });



server.route([
  {
      method: 'GET',
      path: '/',
      config: { auth : false },
      handler: function(request, reply) {
        var url    = server.generate_google_oauth2_url();
    		var imgsrc = 'https://developers.google.com/accounts/images/sign-in-with-google.png';
    		var btn    = '<a href="' + url +'"><img src="' +imgsrc +'" alt="Login With Google"></a>';
        reply(btn);
      }
    }

  ]);

  return next();
};

exports.register.attributes = {
  name: 'Home'
};
