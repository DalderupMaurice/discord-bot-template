import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Consola } from "consola";
import {
  Client,
  ClientEvents,
  Collection,
  ColorResolvable,
  CommandInteraction
} from "discord.js";

export interface ILogger extends Consola {}

export interface IBotConfig {
  token: string;
  applicationId: string;
  guildId: string;
  activity?: string;
}
export interface IBot extends Client<true> {
  readonly logger: ILogger;
  readonly config: IBotConfig;
  readonly command: ICommand;

  start(): Promise<void>;
}

export interface ICommand {
  readonly rest: REST;
  readonly commands: Collection<string, IBotCommand>;
  readonly globalCommands: Collection<string, IBotCommand>;
  readonly guildCommands: Collection<string, IBotCommand>;
  readonly logger: ILogger;
  readonly config: IBotConfig;

  loadCommands(): Promise<void>;
  getCommands(): Promise<{ id: string }[]>;
  getGuildCommands(): Promise<{ id: string }[]>;
  getGlobalCommands(): Promise<{ id: string }[]>;
  registerCommands(): Promise<void>;
  registerGuildCommands(): Promise<void>;
  registerGlobalCommands(): Promise<void>;
  deleteCommands(): Promise<void>;
  deleteGuildCommands(): Promise<void>;
  deleteGlobalCommands(): Promise<void>;
}

export interface IBotCommand {
  readonly name: string;
  readonly global: boolean;
  readonly data: SlashCommandBuilder;

  execute(interaction: CommandInteraction): Promise<void>;
}

export interface IBotEvent {
  readonly name: keyof ClientEvents;
  readonly once: boolean;

  execute(...args: any[]): Promise<void>;
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
