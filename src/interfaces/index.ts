import { Consola } from "consola";
import { ColorResolvable } from "discord.js";

export interface ILogger extends Consola {}

export interface IBotConfig {
  prefix: string;
  token: string;
  commands: string[];
  activity?: string;
}

export interface IBotCommandHelp {
  caption: string;
  description: string;
}

export interface IBot {
  readonly botId: string;
  readonly commands: IBotCommand[];
  readonly logger: ILogger;
  readonly config: IBotConfig;

  start(commandsPath: string, dataPath: string): void;
}

export interface IBotCommand {
  getHelp(): IBotCommandHelp;
  init(bot: IBot, dataPath: string): void;
  isValid(msg: string): boolean;
  process(msg: string, answer: IBotMessage): Promise<void>;
}

export interface IUser {
  id: string;
  username: string;
  discriminator: string;
  tag: string;
}

type MessageColor = ColorResolvable;

export interface IBotMessage {
  readonly user: IUser;
  setTextOnly(text: string): IBotMessage;
  addField(name: string, value: string): IBotMessage;
  addBlankField(name: string, value: string, inline: boolean): IBotMessage;
  setColor(color: MessageColor): IBotMessage;
  setDescription(description: string): IBotMessage;
  setFooter(text: string, icon?: string): IBotMessage;
  setImage(url: string): IBotMessage;
  setThumbnail(url: string): IBotMessage;
  setTitle(title: string): IBotMessage;
  setURL(url: string): IBotMessage;
}
