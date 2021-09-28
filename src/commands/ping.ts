import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { IBotCommand } from "../interfaces";

export default class PingCommand implements IBotCommand {
  name: string;
  data: SlashCommandBuilder;

  constructor() {
    this.name = "ping";
    this.data = new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Replies with Pong!");
  }

  public execute = async (interaction: CommandInteraction): Promise<void> => {
    await interaction.reply("Pong!");
  };
}
