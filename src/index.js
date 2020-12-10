"use strict" 

const dotenv = require("dotenv");
const Hapi = require("@hapi/hapi");

const routes = require("./routes");

const createServer = async () => {
	const server = Hapi.server({ //creates an instance of the hapi server
		port: process.env.PORT || 8080, 
		host: process.env.HOST || "localhost"
	});
	server.route(routes);  //to register the routes defined in the routes module!
	return server;         //output the address of the web Server
};

const init = async () =>{
	dotenv.config();
	const server = await createServer();
	await server.start();
	console.log(`Server running on ${server.info.uri}`)
};

process.on( "unhandledRejection", (err) =>{ // in case an exception occurs anywhere in the application that doesn't have error handling, which outputs the error and shuts down the server.
	console.log( err);
	process.exit( 1 );
} );

init();