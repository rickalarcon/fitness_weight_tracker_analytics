/*
Configuring the hapi application to verify that
only authentificed users can access protected resources.
If not, the app will prompt them to login using Okta!
*/

"use strict";

const bell = require( "@hapi/bell" ); //A hapi plugin to support third-party logins
const cookie = require( "@hapi/cookie" ); //A hapi plugin for cookie-based authentication - cookie store the current user's seccion information

const isSecure = process.env.NODE_ENV === "production";

//To define a HAPI module, you export an object! every hapi module has this pattern: name, version,register
module.exports = {
  name: "auth",
  version: "1.0.0",
  register: async server => {

    await server.register( [ cookie, bell ] ); //using the hapi server, we will register other dependencies!

    // configure cookie authorization strategy for hapi
    server.auth.strategy( "session", "cookie", {
      cookie: {
        name: "okta-oauth",
        path: "/",   //setting it up to the root
        password: process.env.COOKIE_ENCRYPT_PWD, //password to encrypt the session information
        isSecure // Should be set to true (which is the default) in production
      },
      redirectTo: "/authorization-code/callback", // If there is no session, redirect here
    } );

    // configure okta oauth strategy
    server.auth.strategy( "okta", "bell", {
      provider: "okta",
      config: { uri: process.env.OKTA_ORG_URL },
      password: process.env.COOKIE_ENCRYPT_PWD,
      isSecure,
      location: process.env.HOST_URL,
      clientId: process.env.OKTA_CLIENT_ID,
      clientSecret: process.env.OKTA_CLIENT_SECRET
    } );

    // set the default authorization strategy for all routes
    server.auth.default( "session" );

    // Hook into onPreResponse event to add authentication info to every view
    server.ext( "onPreResponse", ( request, h ) => {
      if ( request.response.variety === "view" ) {
        const auth = request.auth.isAuthenticated ? {
          isAuthenticated: true,
          isAnonymous: false,
          email: request.auth.artifacts.profile.email,
          firstName: request.auth.artifacts.profile.firstName,
          lastName: request.auth.artifacts.profile.lastName
        } : {
          isAuthenticated: false,
          isAnonymous: true,
          email: "",
          firstName: "",
          lastName: ""
        };
        request.response.source.context.auth = auth; //allow us to access that data of the person the is autheticated..
      }
      return h.continue;
    } );
  }
};
