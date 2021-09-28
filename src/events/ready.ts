import { ClientEvents } from "discord.js";
import { IBot, IBotEvent } from "../interfaces";

export default class ReadyEvent implements IBotEvent {
  name: keyof ClientEvents;
  once: boolean;

  constructor() {
    this.name = "ready";
    this.once = true;
  }

  public execute = async (client: IBot): Promise<void> => {
    if (client.config.activity) {
      client.user.setActivity(client.config.activity);
    }

    client.logger.success(`Logged in as ${client.user.tag}!`);
  };
}
