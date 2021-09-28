import consola from "consola";
import { Client, Collection, Intents } from "discord.js";
import fs from "fs";
import { REST } from "@discordjs/rest";

import { Routes } from "discord-api-types/v9";
import {
  IBot,
  IBotCommand,
  IBotConfig,
  IBotEvent,
  ILogger
} from "./interfaces";

export default class Bot extends Client<true> implements IBot {
  config: IBotConfig;
  commands: Collection<string, IBotCommand>;
  logger: ILogger;

  public constructor(config: IBotConfig) {
    super({ intents: [Intents.FLAGS.GUILDS] });

    this.logger = consola;
    this.config = config;
    this.commands = new Collection();
  }

  async loadCommands(): Promise<void> {
    const commandFiles = fs
      .readdirSync(`${__dirname}/commands`)
      .filter((file) => file.endsWith(".ts"));

    const promises = commandFiles.map(async (file) => {
      const CmdClass = (await import(`${__dirname}/commands/${file}`)).default;
      const command: IBotCommand = new CmdClass();
      this.commands.set(command.name, command);
      this.logger.info(`command "${command.name}" loaded...`);
    });

    await Promise.all(promises);

    this.logger.info(`Loaded all ${this.commands.size} commands`);
  }

  async registerCommands(): Promise<void> {
    const rest = new REST({ version: "9" }).setToken(this.config.token);
    try {
      this.logger.info("Started refreshing application (/) commands.");

      await rest.put(
        Routes.applicationGuildCommands(
          this.config.applicationId,
          this.config.guildId
        ),
        {
          body: this.commands.mapValues((cmd) => cmd.data.toJSON())
        }
      );

      this.logger.success("Successfully reloaded application (/) commands.");
    } catch (error) {
      this.logger.error(error);
    }
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

    await this.login(this.config.token);
  }
}
