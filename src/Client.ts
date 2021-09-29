import consola from "consola";
import { Client, Intents } from "discord.js";
import fs from "fs";

import { IBot, IBotConfig, IBotEvent, ICommand, ILogger } from "./interfaces";
import Command from "./Command";

export default class Bot extends Client<true> implements IBot {
  config: IBotConfig;
  command: ICommand;
  logger: ILogger;

  public constructor(config: IBotConfig) {
    super({ intents: [Intents.FLAGS.GUILDS] });

    this.logger = consola;
    this.config = config;
    this.command = new Command(this.config);
  }

  async start(): Promise<void> {
    if (!this.config.token) {
      throw new Error("No discord token given");
    }

    const eventFiles = fs
      .readdirSync(`${__dirname}/events`)
      .filter((file) => file.endsWith(".ts"));

    eventFiles.forEach(async (file) => {
      const EventClass = (await import(`${__dirname}/events/${file}`)).default;
      const event: IBotEvent = new EventClass();
      if (event.once) {
        this.once(event.name, (...args) => event.execute(...args));
      } else {
        this.on(event.name, (...args) => event.execute(...args));
      }
    });

    // Load the commands
    await this.command.loadCommands();

    // (Re-)Register the loaded commands
    await this.command.registerCommands();

    // Login to discord
    await this.login(this.config.token);
  }
}
