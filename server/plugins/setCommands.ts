import { settingMyCommands } from "~~/shared/utils/helper";

export default defineNitroPlugin(async (nitro) => {
  const { tlBotToken } = useRuntimeConfig();
  const BASE_URL = `https://api.telegram.org/bot${tlBotToken}`;
  await settingMyCommands(BASE_URL);
});
