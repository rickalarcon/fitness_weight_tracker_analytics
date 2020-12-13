/*
Creating a new hapi plugin to provide every route easy access
to the PostgreSQL client.

The sql plugin creates one instance of the PostgreSQL client
for the entire application and adds it to hapi's response toolkit.
The response toolkit is the h argument you may have noticed passed
to every route handler. Using the server.decorate() function in the
plugin means you can now access the SQL client from any route using
h.sql!

Next, update the src/plugins/index.js module to include the new sql plugin.
*/

"use strict";

const postgres = require( "postgres" );

//Exporting our plugin
module.exports = {
  name: "sql",
  version: "1.0.0",
  register: async server => {

    // create the sql client
    const sql = postgres();

    // add to the request toolkit e.g. h.sql
    server.decorate( "toolkit", "sql", sql ); //adding our sql client to the request toolkit!
  }
};



//Next, update the src/plugins/index.js module to include the new sql plugin.
