// Read environment variables
import { config } from "dotenv";
let localStorage
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
config();

const configurations = {
  PORT: process.env.PORT || 4000,
  mongodb: process.env.mongodb ?? "",
  localStorage
};

export default configurations;
