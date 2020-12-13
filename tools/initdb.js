/*
This Script will be run only ONCE, just to create the DB Table!
if you want to RESET the DB table, then you can re-run this script..

*/

"use strict";

const dotenv = require( "dotenv" );
const postgres = require( "postgres" );

const init = async () => {
  // read environment variables
  dotenv.config();
  try {
    // connect to the local database server
    const sql = postgres(); //this client recognize our enviromental variables automatically!

    console.log( "dropping table, if exists..." );
    await sql`DROP TABLE IF EXISTS measurements`;

    console.log( "creating table..." );
    await sql`CREATE TABLE IF NOT EXISTS measurements (
      id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
      , user_id varchar(50) NOT NULL
      , measure_date date NOT NULL
      , weight numeric(5,1) NOT NULL
    )`;

    await sql.end(); //close our db connection..
  } catch ( err ) {
    console.log( err );
    throw err;
  }
};

//init is async so we can use .then().. cuz it is like a promise 
init().then( () => {
  console.log( "finished" );
} ).catch( () => {
  console.log( "finished with errors" );
} );