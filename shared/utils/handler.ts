import type { ITelegramClient, ValidatedMessage } from "~~/types/api";
import { commandRegistry, type CommandContext } from "./commands";

const getCommand = (text: string): string | null => {
  if (!text.startsWith("/")) return null;
  return text.split(" ")[0]?.slice(1).split("@")[0] ?? null;
};

export const handleCommands = async (
  client: ITelegramClient,
  message: ValidatedMessage,
  llmToken: string,
  memeToken: string,
): Promise<void> => {
  const command = getCommand(message.text);
  const ctx: CommandContext = { client, message, llmToken, memeToken };

  const entry = command
    ? commandRegistry.find((c) => c.command === command)
    : undefined;

  if (entry) {
    await entry.handler(ctx);
  } else {
    const unknown = commandRegistry.find((c) => c.command === "unknown");
    await unknown!.handler(ctx);
  }
};
