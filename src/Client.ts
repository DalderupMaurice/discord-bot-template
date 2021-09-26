import consola from "consola";
import { Client, Intents } from "discord.js";
import path from "path";

import { IBot, IBotCommand, IBotConfig, ILogger } from "./interfaces";
import BotMessage from "./Message";

export default class Bot extends Client implements IBot {
  config: IBotConfig;

  commands: IBotCommand[];

  logger: ILogger;

  botId: string;

  public constructor(config: IBotConfig) {
    super({ intents: [Intents.FLAGS.GUILDS] });

    this.botId = "";
    this.logger = consola;
    this.config = config;
    this.commands = [];
  }

  start(commandsPath: string, dataPath: string): void {
    // this.loadCommands(commandsPath, dataPath);

    if (!this.config.token) {
      throw new Error("No discord token given");
    }

    this.on("ready", () => {
      this.botId = this.user!.id;

      if (this.config.activity) {
        this.user!.setActivity(this.config.activity);
      }

      this.logger.success(`Logged in as ${this.user?.tag}!`);
    });

    this.on("message", async (message) => {
      if (
        !message.author.bot &&
        message.content.startsWith(this.config.prefix)
      ) {
        const text = message.cleanContent;
        this.logger.debug(`[${message.author.tag}] ${text}`);

        this.commands.forEach(async (cmd) => {
          try {
            if (cmd.isValid(text)) {
              const answer = new BotMessage(message.author);

              await cmd.process(text, answer);

              if (answer.isValid()) {
                // TODO fix embed typing issue
                message.reply(
                  answer.text || ({ embed: answer.richText } as any)
                );
              }
            }
          } catch (ex) {
            this.logger.error(ex);
          }
        });
      }
    });

    this.login(this.config.token);
  }

  private loadCommands(commandsPath: string, dataPath: string) {
    if (
      !this.config.commands ||
      !Array.isArray(this.config.commands) ||
      this.config.commands.length === 0
    ) {
      throw new Error("Invalid / empty commands list");
    }

    this.config.commands.forEach(async (cmd) => {
      const CmdClass = await import(`${commandsPath}/${cmd}`);
      const command = new CmdClass() as IBotCommand;
      command.init(this, path.resolve(`${dataPath}/${cmd}`));
      this.commands.push(command);
      this.logger.info(`command "${cmd}" loaded...`);
    });
  }
}
