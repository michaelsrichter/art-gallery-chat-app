// FILE: init-caller.js
require("dotenv").config();
console.log("Environment variables loaded:", process.env); // Log environment variables to check if they are loaded

const { init } = require('./elastic-config');

function callInit() {
  console.log("Calling init function...");
  init();
}
callInit();