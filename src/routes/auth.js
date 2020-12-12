/*
Configure Public and Secure Routes

Now you need to update the routes to return the home page view 
and configure which routes require authentication. 
In the src/routes folder, create a new file named auth.js and paste the following code.

The previous code defines three new routes. 
The /login route by default requires authentication
because it was defined in the src/plugins/auth.js
module with the statement server.auth.default( "session" );.
Any request to /login while the user is not logged in will
result in being redirected to the /authorization-code/callback route.

The /authorization-code/callback route is configured to use the "okta"
 authentication strategy. Any request to this route while the user is not
  logged in will result in being redirected to the Okta login (which includes
   a link to sign up for an account). After successfully logging into Okta, 
   the user will be redirected back to this route. The user's credentials are
    saved in the session cookie and the user is redirected back to the home page.

The /logout route clears the session cookie and redirects the user back to the home page.
*/

"use strict";

const boom = require( "@hapi/boom" ); //A hapi plugin for HTTP errors


//Login route , we know we are using cookie strategy for sessions!
const login = {
  method: "GET",
  path: "/login",
  options: {
    handler: request => {
      if ( !request.auth.isAuthenticated ) {
        return `Authentication failed due to: ${ request.auth.error.message }`;
      }
    }
  }
};

const oAuthCallback = {
  method: "GET",
  path: "/authorization-code/callback",
  handler: ( request, h ) => {
    if ( !request.auth.isAuthenticated ) {
      throw boom.unauthorized( `Authentication failed: ${ request.auth.error.message }` );
    }
    // save the credentials to the session cookie
    request.cookieAuth.set( request.auth.credentials );
    return h.redirect( "/" );
  },
  options: {
    auth: "okta"
  }
};

const logout = {
  method: "GET",
  path: "/logout",
  handler: ( request, h ) => {
    try {
      if ( request.auth.isAuthenticated ) {
        // clear the local session
        request.cookieAuth.clear();
      }

      return h.redirect( "/" );
    } catch ( err ) {
      request.log( [ "error", "logout" ], err );
    }
  },
  options: {
    auth: {
      mode: "try"
    }
  }
};

//Exporting the 3 routes as an array!
module.exports = [
  login,
  oAuthCallback,
  logout
];

//Next -> lets go to routes/index.js and add our routes!