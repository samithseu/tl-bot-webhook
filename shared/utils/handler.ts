import type { IncomingRequest } from "~~/types/api";
import {
  askCommand,
  helpCommand,
  startCommand,
  jokeCommand,
  meCommand,
  memeCommand,
  profileCommand,
  quoteCommand,
  unknownCommand,
} from "./commands";

// HANDLE COMMANDS
export const handleCommands = async (
  baseUrl: string,
  msgObj: IncomingRequest,
  llmToken: string,
  memeToken: string,
  TLBotToken: string
) => {
  if (!baseUrl) {
    console.error("[ERROR]: Bot endpoint is not defined!");
    return;
  }
  if (!msgObj || msgObj.message.text.length === 0) {
    console.error("[ERROR]: incoming request is not defined!");
    return;
  }

  let command: string | undefined;
  if (msgObj.message.text.startsWith("/")) {
    command = msgObj.message.text.split(" ")[0]?.slice(1) ?? undefined;

    // each command
    switch (command) {
      case "start":
        await startCommand(baseUrl, msgObj);
        break;
      case "help":
        await helpCommand(baseUrl, msgObj);
        break;
      case "me":
        await meCommand(baseUrl, msgObj);
        break;
      case "quote":
        await quoteCommand(baseUrl, msgObj);
        break;
      case "joke":
        await jokeCommand(baseUrl, msgObj);
        break;
      case "ask":
        await askCommand(baseUrl, msgObj, llmToken);
        break;
      case "meme":
        await memeCommand(baseUrl, msgObj, memeToken);
        break;
      case "profile":
        await profileCommand(baseUrl, msgObj, TLBotToken);
        break;
      default:
        await unknownCommand(baseUrl, msgObj);
        break;
    }
  } else {
    await unknownCommand(baseUrl, msgObj);
  }
};
