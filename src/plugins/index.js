/*
In addition to registering the new auth plugin, this code also configures the ejs, inert, and vision plugins to render HTML content. Let's set up a few EJS templates.

Next, update src/index.js to import the new plugins module and call the plugins.register() function.

*/

"use strict";

const Inert = require( "@hapi/inert" ); //A hapi plugin for serving static files
const Vision = require( "@hapi/vision" ); // A hapi plugin for rendering server-side HTML templates
const ejs = require( "ejs" );  //js templates 

const auth = require( "./auth" ); //authentification we just created..
const sql = require("./sql"); //adding our postgresql plugin
module.exports = {
  register: async server => {
    await server.register( [ Inert, Vision, auth, sql ] ); //we gonna register those plugins

    // configure view templates
    server.views( {
      engines: { ejs },
      relativeTo: __dirname,
      path: "../templates",
      layout: true
    } );
  }
};