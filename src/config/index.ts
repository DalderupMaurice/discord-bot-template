import * as dotenv from "dotenv";
import { IBotConfig } from "../interfaces";

const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const CONFIG = {
  token: process.env.TOKEN as string,
  activity: process.env.ACTIVITY as string,
  clientId: process.env.CLIENT_ID as string,
  guildId: process.env.GUILD_ID as string,
  register: process.env.REGISTER === "true"
} as IBotConfig;

export default CONFIG;
