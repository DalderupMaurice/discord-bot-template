import consola from "consola";
import { Collection } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import fs from "fs";

import { IBotCommand, IBotConfig, ICommand, ILogger } from "./interfaces";

export default class Command implements ICommand {
  rest: REST;
  logger: ILogger;
  config: IBotConfig;
  commands: Collection<string, IBotCommand>;
  globalCommands: Collection<string, IBotCommand>;
  guildCommands: Collection<string, IBotCommand>;

  public constructor(config: IBotConfig) {
    this.logger = consola;
    this.config = config;
    this.commands = new Collection();
    this.globalCommands = new Collection();
    this.guildCommands = new Collection();
    this.rest = new REST({ version: "9" }).setToken(this.config.token);
  }

  async loadCommands(): Promise<void> {
    const commandFiles = fs
      .readdirSync(`${__dirname}/commands`)
      .filter((file) => file.endsWith(".ts"));

    const promises = commandFiles.map(async (file) => {
      const CmdClass = (await import(`${__dirname}/commands/${file}`)).default;
      const command: IBotCommand = new CmdClass();
      this.commands.set(command.name, command);
      this.logger.info(
        `${command.global ? "Global" : "Guild"} command "${
          command.name
        }" loaded.`
      );
    });

    await Promise.all(promises);

    this.globalCommands = this.commands.filter((cmd) => cmd.global);
    this.guildCommands = this.commands.filter((cmd) => !cmd.global);
  }

  async getCommands(): Promise<{ id: string }[]> {
    try {
      return [
        ...(await this.getGlobalCommands()),
        ...(await this.getGuildCommands())
      ];
    } catch (error) {
      this.logger.error(error);
      return [];
    }
  }

  getGuildCommands(): Promise<{ id: string }[]> {
    return this.rest.get(
      Routes.applicationGuildCommands(
        this.config.applicationId,
        this.config.guildId
      ),
      {
        body: this.guildCommands.mapValues((cmd) => cmd.data.toJSON())
      }
    ) as Promise<{ id: string }[]>;
  }

  getGlobalCommands(): Promise<{ id: string }[]> {
    return this.rest.get(
      Routes.applicationCommands(this.config.applicationId),
      {
        body: this.globalCommands.mapValues((cmd) => cmd.data.toJSON())
      }
    ) as Promise<{ id: string }[]>;
  }

  async registerCommands(): Promise<void> {
    try {
      await this.registerGlobalCommands();
      await this.registerGuildCommands();
      this.logger.success(
        `Successfully (RE)LOADED ${this.globalCommands.size} Global and ${this.guildCommands.size} Guild commands.`
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  async registerGuildCommands(): Promise<void> {
    const { size } = this.guildCommands;

    if (size > 0) {
      this.logger.info(`Registering ${size} Guild commands.`);
      await this.rest.put(
        Routes.applicationGuildCommands(
          this.config.applicationId,
          this.config.guildId
        ),
        {
          body: this.guildCommands.mapValues((cmd) => cmd.data.toJSON())
        }
      );
    }
  }

  async registerGlobalCommands(): Promise<void> {
    const { size } = this.globalCommands;

    if (size > 0) {
      this.logger.info(`Registering ${size} Global command(s).`);
      await this.rest.put(
        Routes.applicationCommands(this.config.applicationId),
        {
          body: this.globalCommands.mapValues((cmd) => cmd.data.toJSON())
        }
      );
    }
  }

  async deleteGuildCommands(): Promise<void> {
    this.logger.info("Deleting Guild application (/) commands.");

    const commands = await this.getGuildCommands();

    const promises = commands.map(async (cmd) => {
      this.rest.delete(
        Routes.applicationGuildCommand(
          this.config.applicationId,
          this.config.guildId,
          cmd.id
        )
      );
    });

    await Promise.all(promises);
  }

  async deleteGlobalCommands(): Promise<void> {
    this.logger.info("Deleting Global application (/) commands.");

    const commands = await this.getGlobalCommands();

    const promises = commands.map(async (cmd) => {
      this.rest.delete(
        Routes.applicationCommand(this.config.applicationId, cmd.id)
      );
    });

    await Promise.all(promises);
  }

  async deleteCommands(): Promise<void> {
    try {
      await this.deleteGlobalCommands();
      await this.deleteGuildCommands();

      this.logger.success("Successfully DELETED ALL application (/) commands.");
    } catch (error) {
      this.logger.error(error);
    }
  }
}
