"use strict" 

const dotenv = require("dotenv");
// const Hapi = require("@hapi/hapi");

// const plugins = require( "./plugins" ); //importing the new plugins module to call the plugins.register() function.
// const routes = require("./routes");

const createServer = require( "./server" ).createServer;

const init = async () =>{
	dotenv.config();
	const config = {
		port: process.env.PORT || 5000,
		host: process.env.HOST || "localhost"
	};
	const server = await createServer( config);
	await server.start();
	console.log(`Server running on ${server.info.uri}`)
};

process.on( "unhandledRejection", (err) =>{ // in case an exception occurs anywhere in the application that doesn't have error handling, which outputs the error and shuts down the server.
	console.log( err);
	process.exit( 1 );
} );

init();