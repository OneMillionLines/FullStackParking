'use strict';
const Hapi = require("@hapi/hapi"),
  routes = require("./routes");
const server = Hapi.server({
  host: "localhost",
  port: 5000,
  routes: {
    //cross origin request
    cors: true
  }
});
routes.forEach(route => {
  //register the routes
  server.route(route);
});
async function start() {
  try {
    await server.start();
  } catch (err) {
    console.log(err);
  }
  console.log(`Hapi server is running at ${server.info.uri}`);
}
start();