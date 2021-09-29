import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { IBotCommand } from "../interfaces";

export default class PingCommand implements IBotCommand {
  name: string;
  global: boolean;
  data: SlashCommandBuilder;

  constructor() {
    this.name = "ping";
    this.global = true;
    this.data = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription("Replies with Pong!");
  }

  public execute = async (interaction: CommandInteraction): Promise<void> => {
    await interaction.reply("Pong!");
  };
}
