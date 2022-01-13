// Read environment variables
import { config } from "dotenv";
config();

const configurations = {
  PORT: process.env.PORT || 4000,
  mongodb: process.env.mongodb ?? ""
};

export default configurations;
