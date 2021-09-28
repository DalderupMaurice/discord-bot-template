import { ClientEvents, Interaction } from "discord.js";
import { IBot, IBotEvent } from "../interfaces";

export default class InteractionCreateEvent implements IBotEvent {
  name: keyof ClientEvents;
  once: boolean;

  constructor() {
    this.name = "interactionCreate";
    this.once = false;
  }

  public execute = async (interaction: Interaction): Promise<void> => {
    if (!interaction.isCommand()) return;

    const client = interaction.client as IBot;
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      client.logger.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true
      });
    }
  };
}
