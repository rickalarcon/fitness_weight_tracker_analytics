/*
For each of the API routes, the auth mode is set to try. 
Then for each route, the code first checks to see if the user is authenticated.
 If not, the handler immediately returns a "401 (unauthorized)" error.

Some of the routes accept a parameter as part of the path (e.g. getMeasurementForCurrentUserById())
or values as a payload (e.g. addMeasurementForCurrentUser()). These routes use joi to validate all
required values and values are the correct types.

The postgres client is used for each of these routes to execute SQL statements. 
These statements are expressed as JavaScript template literals.
The currently authenticated user id is used with every statement
to ensure no data is leaked between accounts. The SQL client returns data as JSON,
which hapi transparently returns to the browser or whatever HTTP client is requesting the API.
*/

"use strict";

const boom = require( "@hapi/boom" ); // A hapi plugin for HTTP errors
const joi = require( "@hapi/joi" );   // A hapi plugin for validating request and response data

// add a new measurement for the current user
const addMeasurementForCurrentUser = {
  method: "POST",
  path: "/api/measurements",
  handler: async ( request, h ) => {
    try {
      if ( !request.auth.isAuthenticated ) {
        return boom.unauthorized();
      }
      const userId = request.auth.credentials.profile.id;
      const { measureDate, weight } = request.payload;
      const res = await h.sql`INSERT INTO measurements
        ( user_id, measure_date, weight )
        VALUES
        ( ${ userId }, ${ measureDate }, ${ weight } )

        RETURNING
            id
            , measure_date AS "measureDate"
            , weight`;
      return res.count > 0 ? res[0] : boom.badRequest();
    } catch ( err ) {
      console.log( err );
      return boom.serverUnavailable();
    }
  },
  options: {
    auth: { mode: "try" },
    validate: {
      payload: joi.object( {
        measureDate: joi.date(),
        weight: joi.number()
      } )
    }
  }
};

// retrieve all measurements for the current user
const allMeasurementsForCurrentUser = {
  method: "GET",
  path: "/api/measurements",
  handler: async ( request, h ) => {
    try {
      if ( !request.auth.isAuthenticated ) {
        return boom.unauthorized();
      }
      const userId = request.auth.credentials.profile.id;
      const measurements = await h.sql`SELECT
            id
            , measure_date AS "measureDate"
            , weight
        FROM  measurements
        WHERE user_id = ${ userId }
        ORDER BY measure_date`;
      return measurements;
    } catch ( err ) {
      console.log( err );
      return boom.serverUnavailable();
    }
  },
  options: {
    auth: { mode: "try" }
  }
};

// delete a measurement for the current user by id
const deleteMeasurementForCurrentUserById = {
  method: "DELETE",
  path: "/api/measurements/{id}",
  handler: async ( request, h ) => {
    try {
      if ( !request.auth.isAuthenticated ) {
        return boom.unauthorized();
      }
      const userId = request.auth.credentials.profile.id;
      const id = request.params.id;
      const res = await h.sql`DELETE
        FROM  measurements
        WHERE id = ${ id }
            AND user_id = ${ userId }`;
      return res.count > 0 ? h.response().code( 204 ) : boom.notFound();
    }
    catch( err ) {
      console.log( err );
      return boom.serverUnavailable();
    }
  },
  options: {
    auth: { mode: "try" },
    validate: {
      params: joi.object( {
        id: joi.number().integer()
      } )
    }
  }
};

// get one measurement for the current user by id
const getMeasurementForCurrentUserById = {
  method: "GET",
  path: "/api/measurements/{id}",
  handler: async ( request, h ) => {
    try {
      if ( !request.auth.isAuthenticated ) {
        return boom.unauthorized();
      }
      const userId = request.auth.credentials.profile.id;
      const id = request.params.id;
      const res = await h.sql`SELECT
            id
            , measure_date AS "measureDate"
            , weight
        FROM  measurements
        WHERE user_id = ${ userId }
            AND id = ${ id }`;
      return res.count > 0 ? res[0] : boom.notFound();
    } catch ( err ) {
      console.log( err );
      return boom.serverUnavailable();
    }
  },
  options: {
    auth: { mode: "try" },
    validate: {
      params: joi.object( {
        id: joi.number().integer().message( "id parameter must be number" )
      } )
    }
  }
};

// update a measurement for the current user by id
const updateMeasurementForCurrentUserById = {
  method: "PUT",
  path: "/api/measurements/{id}",
  handler: async ( request, h ) => {
    try {
      if ( !request.auth.isAuthenticated ) {
        return boom.unauthorized();
      }
      const userId = request.auth.credentials.profile.id;
      const id = request.params.id;
      const { measureDate, weight } = request.payload;
      const res = await h.sql`UPDATE measurements
        SET measure_date = ${ measureDate }
            , weight = ${ weight }
        WHERE id = ${ id }
        AND user_id = ${ userId }

        RETURNING
        id
        , measure_date AS "measureDate"
        , weight`;
      return res.count > 0 ? res[0] : boom.notFound();
    }
    catch( err ) {
      console.log( err );
      return boom.serverUnavailable();
    }
  },
  options: {
    auth: { mode: "try" },
    validate: {
      params: joi.object( {
        id: joi.number().integer()
      } ),
      payload: joi.object( {
        measureDate: joi.date(),
        weight: joi.number()
      } )
    }
  }
};

module.exports = [
  addMeasurementForCurrentUser,
  allMeasurementsForCurrentUser,
  deleteMeasurementForCurrentUserById,
  getMeasurementForCurrentUserById,
  updateMeasurementForCurrentUserById
];