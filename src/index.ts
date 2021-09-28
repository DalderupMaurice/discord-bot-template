import CONFIG from "./config";
import Client from "./Client";

(async () => {
  const client = new Client(CONFIG);
  await client.loadCommands();

  if (CONFIG.register) {
    await client.registerCommands();
  }

  await client.start();
})();
