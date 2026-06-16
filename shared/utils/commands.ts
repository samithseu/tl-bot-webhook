import type {
  ValidatedMessage,
  BotCommand,
  ITelegramClient,
  JokeType,
  AIResponseType,
} from "~~/types/api";
import {
  QUOTE_API,
  JOKE_API,
  OPENROUTER_API,
  AI_MODEL,
  AI_SYSTEM_PROMPT,
  MEME_API,
} from "~~/shared/constants";

export interface CommandHandler {
  command: string;
  description: string;
  handler: (ctx: CommandContext) => Promise<void>;
}

export interface CommandContext {
  client: ITelegramClient;
  message: ValidatedMessage;
  llmToken: string;
  memeToken: string;
}

const sendTyping = (client: ITelegramClient, chatId: number) =>
  client.sendChatAction(chatId, "typing");

const sendUploading = (client: ITelegramClient, chatId: number) =>
  client.sendChatAction(chatId, "upload_photo");

const replyWithError = async (
  client: ITelegramClient,
  chatId: number,
  context: string,
) => {
  await client.sendMessage(chatId, `Sorry, I couldn't get ${context} 🙁`);
};

const handleStart = async (ctx: CommandContext) => {
  const { client, message } = ctx;
  await sendTyping(client, message.chat.id);
  await client.sendMessage(
    message.chat.id,
    `Hello, <b>${message.from.first_name}!</b>\nWelcome to <a href="https://t.me/this_is_sigma_bot">this_is_sigma_bot</a> 🗿`,
    { parse_mode: "HTML" },
  );
};

const handleHelp = async (ctx: CommandContext) => {
  const { client, message } = ctx;
  await sendTyping(client, message.chat.id);
  const commandsList = commandRegistry
    .filter((c) => c.command !== "unknown")
    .map((c) => `| /${c.command} | ${c.description} |`)
    .join("\n");
  const markdown = `# 🤖 Bot Commands\n\nHere are all the commands I support:\n\n| Command | Description |\n|:--------|:------------|\n${commandsList}\n\n---\n\n_Tip: Use \`/ask <query>\` to ask me anything using AI!_`;
  await client.sendRichMessage(message.chat.id, { markdown });
};

const handleMe = async (ctx: CommandContext) => {
  const { client, message } = ctx;
  await sendTyping(client, message.chat.id);
  const { id, first_name: name, username, is_premium } = message.from;
  const isOwner = username === "samithseu";

  await client.sendMessage(
    message.chat.id,
    `<blockquote>Telegram Account Info: </blockquote>\n` +
      `- <b>ID:                </b><code>${id}</code>\n` +
      `- <b>Name:          </b><code>${name}</code>\n` +
      `- <b>Username:  </b><a href="tg://user?id=${id}">@${username}</a>\n` +
      `- <b>Is Premium: </b><code>${is_premium ? "✅" : "❌"}</code>\n` +
      `- <b>Bot Owner:   </b><code>${isOwner ? "✅" : "❌"}</code>`,
    { parse_mode: "HTML" },
  );
};

const handleQuote = async (ctx: CommandContext) => {
  const { client, message } = ctx;
  await sendTyping(client, message.chat.id);
  try {
    const data = await $fetch<{ q: string; a: string }[]>(QUOTE_API);
    const quote = data[0]?.q ?? "";
    const author = data[0]?.a ?? "";
    await client.sendRichMessage(message.chat.id, {
      html: `<blockquote>${quote}</blockquote>\n<b>— ${author}</b>`,
    });
  } catch {
    await replyWithError(client, message.chat.id, "a quote");
  }
};

const handleJoke = async (ctx: CommandContext) => {
  const { client, message } = ctx;
  await sendTyping(client, message.chat.id);
  try {
    const data = await $fetch<JokeType>(JOKE_API);
    await client.sendMessage(
      message.chat.id,
      `<blockquote>${data.setup}</blockquote>\nAnswer: <span class='tg-spoiler'>${data.delivery}</span>`,
      { parse_mode: "HTML" },
    );
  } catch {
    await replyWithError(client, message.chat.id, "a joke");
  }
};

const handleAsk = async (ctx: CommandContext) => {
  const { client, message, llmToken } = ctx;

  if (!message.text.includes(" ")) {
    await client.sendRichMessage(message.chat.id, {
      html: "Example: <code>/ask What's AI?</code>",
    });
    return;
  }

  await sendTyping(client, message.chat.id);
  await sendTyping(client, message.chat.id);
  const query = message.text.slice(message.text.indexOf(" ") + 1);

  try {
    const AIres = await $fetch<AIResponseType>(OPENROUTER_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${llmToken}`,
        "Content-Type": "application/json",
      },
      body: {
        model: AI_MODEL,
        messages: [
          { role: "user", content: AI_SYSTEM_PROMPT },
          { role: "user", content: query },
        ],
      },
    });
    await client.sendRichMessage(message.chat.id, {
      markdown: AIres.choices[0]?.message.content ?? "No response!",
    });
  } catch {
    await replyWithError(client, message.chat.id, "the response");
  }
};

const handleMeme = async (ctx: CommandContext) => {
  const { client, message } = ctx;
  await sendUploading(client, message.chat.id);
  await sendUploading(client, message.chat.id);

  try {
    const res = await $fetch<{ url: string; title: string; subreddit: string }>(MEME_API);
    const image = res.url;
    if (!image) {
      await replyWithError(client, message.chat.id, "meme photo");
      return;
    }
    await client.sendPhoto(message.chat.id, image, {
      caption: `<b>${res.title}</b>\n<code>r/${res.subreddit}</code>`,
      parse_mode: "HTML",
    });
  } catch {
    await replyWithError(client, message.chat.id, "meme photo");
  }
};

const handleProfile = async (ctx: CommandContext) => {
  const { client, message } = ctx;
  await sendUploading(client, message.chat.id);

  try {
    const photos = await client.getUserProfilePhotos(message.from.id, 0, 1);
    if (photos && photos.total_count > 0) {
      const fileId = photos.photos[0]?.at(-1)?.file_id;
      if (fileId) {
        await client.sendPhoto(message.chat.id, fileId);
        return;
      }
    }
    await client.sendMessage(
      message.chat.id,
      "Sorry, You've got no profile photo 🙁",
    );
  } catch {
    await replyWithError(client, message.chat.id, "user profile photo");
  }
};

const handleUnknown = async (ctx: CommandContext) => {
  const { client, message } = ctx;
  await client.sendMessage(
    message.chat.id,
    `${message.text}\n\nSorry, I didn't understand this 🙁\nType /help for all valid commands.`,
  );
};

export const commandRegistry: CommandHandler[] = [
  { command: "start", description: "Greetings!", handler: handleStart },
  {
    command: "me",
    description: "Show Telegram account info.",
    handler: handleMe,
  },
  {
    command: "quote",
    description: "Fetch random quote from Internet.",
    handler: handleQuote,
  },
  {
    command: "joke",
    description: "Fetch random joke from Internet.",
    handler: handleJoke,
  },
  {
    command: "ask",
    description: "Ask AI about something. (briefly)",
    handler: handleAsk,
  },
  {
    command: "meme",
    description: "Fetch programming meme from Internet.",
    handler: handleMeme,
  },
  {
    command: "profile",
    description: "Get your profile photo.",
    handler: handleProfile,
  },
  { command: "help", description: "Show all commands.", handler: handleHelp },
  { command: "unknown", description: "", handler: handleUnknown },
];

export const allCommands: BotCommand[] = commandRegistry.map(
  ({ command, description }) => ({ command, description }),
);
