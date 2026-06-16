import { TelegramClient } from "~~/server/utils/telegram";
import { allCommands } from "~~/shared/utils/commands";

export default defineNitroPlugin(async () => {
  const { tlBotToken } = useRuntimeConfig();
  const client = new TelegramClient(tlBotToken);
  await client.setMyCommands(allCommands);
});
