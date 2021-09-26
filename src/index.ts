import { Client, Intents } from "discord.js";
import consola from "consola";
import CONFIG from "./config";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on("ready", () => {
  consola.log(`Logged in as ${client.user?.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
});

client.login(CONFIG.TOKEN);
