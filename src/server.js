
"use strict";

const Hapi = require( "@hapi/hapi" );
const registerPlugins = require( "./plugins" ).register;
const routes = require( "./routes" );

const createServer = async config => {

	const server = Hapi.server( {
		port: config.port,
		host: config.host,
		routes: {
			validate: {
				failAction: ( request, h, err ) => {
					throw err;
				}
			}
		}
	} );

	await registerPlugins( server, config );
	server.route( routes );

	return server;
};

module.exports = {
	createServer
};

// const createServer = async () => {
// 	const server = Hapi.server({ //creates an instance of the hapi server
// 		port: process.env.PORT || 5000, 
// 		host: process.env.HOST || "localhost"
// 	});

// 	await plugins.register( server );
// 	server.route(routes);  //to register the routes defined in the routes module!
// 	return server;         //output the address of the web Server
// };