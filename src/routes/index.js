//before
// "use strict";
// const home = {
// 	method: "GET",
// 	path: "/",
// 	handler: (req,res) => {return "Happy Hacking!!";}
// };
// module.exports = [home];

/*
The previous code updates the home page route with an auth mode try.
 The try mode checks to see if the user is authenticated, 
 but doesn't require authentication. The code also imports the 
 authentication routes, and sets up routes for static assets and the custom 404 page.
*/

"use strict";

const path = require( "path" ); //build-in node js module
const auth = require( "./auth" );

const api = require("./api");
const measurements = require( "./measurements");

const home = {
  method: "GET",
  path: "/",
  options: {
    auth: {
      mode: "try"  //allow us to see where the user is logged in or not, if thats require the use to be but it just help us check
    },
    handler: ( request, h ) => {
      return h.view( "index", { title: "Home" } );
    }
  }
};

// StaticAssests: like CSS files, JS files, imagens, everything we want to package with our 
//application
const staticAssets = {
  method: "GET",
  path: "/assets/{param_}",
  handler: {
    directory:{
      path: path.join( __dirname, "..", "assets" )
    }
  },
  options: { auth: false } //authentication is not require to access any of this files
};

const error404 = {
  method: "_",
  path: "/{any*}",  //anything that is not specify in our routes will return an error
  handler: function ( request, h ) {
    return h.view( "404", { title: "Not Found" } ).code( 404 );
  },
  options: { auth: false } //authentification is not require to view the 404 page
};

module.exports = [
  home,
  staticAssets,
  error404
].concat( api,auth, measurements ); //passing these back
