import type { EventHandlerRequest, H3Event } from "h3";
import type { IncomingRequest, ValidatedMessage } from "~~/types/api";
import { handleCommands } from "~~/shared/utils/handler";
import { TelegramClient } from "~~/server/utils/telegram";

const validate = (
  req: IncomingRequest,
): { message: ValidatedMessage } | null => {
  if (!req.message?.text) return null;
  const m = req.message;
  return {
    message: {
      message_id: m.message_id,
      from: m.from,
      chat: m.chat,
      date: m.date,
      text: m.text!,
    },
  };
};

export default defineEventHandler(
  async (event: H3Event<EventHandlerRequest>) => {
    const { tlBotToken, openRouterToken } =
      useRuntimeConfig(event);

    const req = await readBody<IncomingRequest>(event);
    if (!req) return;

    const validated = validate(req);
    if (!validated) return;

    const m = validated.message;
    console.log(
      `[LOG]: "${m.text}" by ${m.from.username} (${m.from.id}) at ${new Date(m.date * 1000).toLocaleString()}`,
    );

    const client = new TelegramClient(tlBotToken);
    await handleCommands(
      client,
      validated.message,
      openRouterToken,
    );
  },
);
