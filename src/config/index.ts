import * as dotenv from "dotenv";
import { IBotConfig } from "../interfaces";

const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const CONFIG = {
  token: process.env.TOKEN as string,
  prefix: process.env.PREFIX as string,
  commands: process.env.COMMANDS?.split(",") as string[],
  activity: process.env.ACTIVITY as string
} as IBotConfig;

export default CONFIG;
