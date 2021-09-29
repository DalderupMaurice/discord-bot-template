import * as dotenv from "dotenv";
import { IBotConfig } from "../interfaces";

const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const CONFIG = {
  token: process.env.TOKEN as string,
  activity: process.env.ACTIVITY as string,
  applicationId: process.env.APPLICATION_ID as string,
  guildId: process.env.GUILD_ID as string
} as IBotConfig;

export default CONFIG;
