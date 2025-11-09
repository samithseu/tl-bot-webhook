import type { EventHandlerRequest, H3Event } from "h3";
import type { IncomingRequest } from "~~/types/api";
import { logging, settingMyCommands } from "~~/shared/utils/helper";
import { handleCommands } from "~~/shared/utils/handler";

export default defineEventHandler(
  async (event: H3Event<EventHandlerRequest>) => {
    const { tlBotToken, openRouterToken, funnyPhotoToken } =
      useRuntimeConfig(event);
    const BASE_URL = `https://api.telegram.org/bot${tlBotToken}`;

    const res = await readBody<IncomingRequest>(event);
    if (res) {
      logging(res);
      await handleCommands(
        BASE_URL,
        res,
        openRouterToken,
        funnyPhotoToken,
        tlBotToken
      );
    }
  }
);
