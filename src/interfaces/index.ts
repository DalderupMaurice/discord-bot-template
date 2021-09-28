import { SlashCommandBuilder } from "@discordjs/builders";
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
  clientId: string;
  guildId: string;
  register: boolean;
  activity?: string;
}
export interface IBot extends Client<true> {
  readonly commands: Collection<string, IBotCommand>;
  readonly logger: ILogger;
  readonly config: IBotConfig;

  loadCommands(): Promise<void>;
  registerCommands(): Promise<void>;
  start(): void;
}

export interface IBotCommand {
  readonly name: string;
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
