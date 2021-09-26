import * as dotenv from "dotenv";

const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const CONFIG = {
  TOKEN: process.env.TOKEN,
  PREFIX: process.env.PREFIX,
  COMMANDS: process.env.COMMANDS,
  ACTIVITY: process.env.ACTIVITY
};

export default CONFIG;
