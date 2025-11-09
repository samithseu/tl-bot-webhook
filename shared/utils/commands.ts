import type {
  AIResponseType,
  BotCommand,
  IncomingRequest,
  JokeType,
  MemeType,
} from "~~/types/api";
import {
  gettingFile,
  gettingUserProfilePhoto,
  sendingChatAction,
  sendingMessage,
  sendingPhoto,
} from "./helper";

export const allCommands: BotCommand[] = [
  { command: "start", description: "Greetings!" },
  { command: "me", description: "Show Telegram account info." },
  { command: "quote", description: "Fetch random quote from Internet." },
  { command: "joke", description: "Fetch random joke from Internet." },
  { command: "ask", description: "Ask AI about something. (briefly)" },
  { command: "meme", description: "Fetch programming meme from Internet." },
  { command: "profile", description: "Get your profile photo." },
  { command: "help", description: "Show all commands." },
];

export const startCommand = async (
  baseUrl: string,
  msgObj: IncomingRequest
) => {
  await sendingChatAction(baseUrl, msgObj, "typing");
  return await sendingMessage(
    baseUrl,
    msgObj,
    `Hello, <b>${msgObj.message.from.first_name}!</b>\nWelcome to <a href="https://t.me/this_is_sigma_bot">this_is_sigma_bot</a> 🗿`,
    { parse_mode: "HTML" }
  );
};

export const helpCommand = async (baseUrl: string, msgObj: IncomingRequest) => {
  await sendingChatAction(baseUrl, msgObj, "typing");
  return await sendingMessage(
    baseUrl,
    msgObj,
    `Here are all the commands:\n\n${allCommands
      .map((command) => `/${command.command} - ${command.description}`)
      .join("\n")}`
  );
};

export const meCommand = async (baseUrl: string, msgObj: IncomingRequest) => {
  await sendingChatAction(baseUrl, msgObj, "typing");
  const id = msgObj.message.from.id;
  const name = msgObj.message.from.first_name;
  const username = msgObj.message.from.username;
  const isPrem = msgObj.message.from.is_premium;
  const isBA = msgObj.message.from.username === "samithseu";

  return await sendingMessage(
    baseUrl,
    msgObj,
    `<blockquote>Telegram Account Info: </blockquote>
- <b>ID:                        </b><code>${id}</code>
- <b>Name:                </b><code>${name}</code>
- <b>Username:        </b><a href="tg://user?id=${id}">@${username}</a>
- <b>Is Premium:     </b><code>${isPrem ? "✅" : "❌"}</code>
- <b>Bot Owner:      </b><code>${isBA ? "✅" : "❌"}</code>
    `,
    { parse_mode: "HTML" }
  );
};

export const quoteCommand = async (
  baseUrl: string,
  msgObj: IncomingRequest
) => {
  try {
    await sendingChatAction(baseUrl, msgObj, "typing");
    const data = await $fetch<{ quote?: string; author?: string }>(
      "https://quotes-api-self.vercel.app/quote"
    );
    return await sendingMessage(
      baseUrl,
      msgObj,
      `<blockquote>${data?.quote ?? ""}</blockquote> By <i>${
        data?.author ?? ""
      }</i>`,
      { parse_mode: "HTML" }
    );
  } catch (error) {
    console.error("[ERROR]: ", error);
    return await sendingMessage(
      baseUrl,
      msgObj,
      `Sorry, I couldn't get a quote 🙁`
    );
  }
};

export const jokeCommand = async (baseUrl: string, msgObj: IncomingRequest) => {
  try {
    await sendingChatAction(baseUrl, msgObj, "typing");
    const data = await $fetch<JokeType>(
      "https://v2.jokeapi.dev/joke/Any?type=twopart"
    );
    return await sendingMessage(
      baseUrl,
      msgObj,
      `<blockquote>${data.setup}</blockquote>\nAnswer: <span class='tg-spoiler'>${data.delivery}</span>`,
      { parse_mode: "HTML" }
    );
  } catch (error) {
    console.error("[ERROR]: ", error);
    return await sendingMessage(
      baseUrl,
      msgObj,
      `Sorry, I couldn't get a joke 🙁`
    );
  }
};

export const askCommand = async (
  baseUrl: string,
  msgObj: IncomingRequest,
  token: string
) => {
  try {
    if (msgObj.message.text === "/ask") {
      return await sendingMessage(
        baseUrl,
        msgObj,
        "Example: <code>/ask What's AI?</code>",
        { parse_mode: "HTML" }
      );
    }
    await sendingChatAction(baseUrl, msgObj, "typing");
    await sendingChatAction(baseUrl, msgObj, "typing");
    const query = msgObj.message.text.slice("/ask ".length);

    const url = "https://openrouter.ai/api/v1/chat/completions";
    const bodyData = {
      model: "minimax/minimax-m2:free",
      messages: [
        {
          role: "user",
          content:
            "You are the smartest assistant in the world and whenever you get asked any question, please concisely answer it. Do not answer it really long. Also if user is asking to write code, just wrap the code result in ``` and ``` as well. Just keep it short and exactly what the user asked.",
        },
        { role: "user", content: query },
      ],
    };

    const AIres: AIResponseType = await $fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });
    return await sendingMessage(
      baseUrl,
      msgObj,
      AIres.choices[0]?.message.content ?? "No response!",
      {
        parse_mode: "Markdown",
      }
    );
  } catch (error) {
    console.error("[ERROR]: ", error);
    return await sendingMessage(
      baseUrl,
      msgObj,
      `Sorry, I couldn't get the response 🙁`
    );
  }
};

export const memeCommand = async (
  baseUrl: string,
  msgObj: IncomingRequest,
  token: string
) => {
  try {
    await sendingChatAction(baseUrl, msgObj, "upload_photo");
    await sendingChatAction(baseUrl, msgObj, "upload_photo");

    const url = "https://programming-memes-images.p.rapidapi.com/v1/memes";
    const headers = {
      "x-rapidapi-key": token,
      "x-rapidapi-host": "programming-memes-images.p.rapidapi.com",
    };

    const res: MemeType[] = await $fetch(url, { method: "GET", headers });
    return await sendingPhoto(baseUrl, msgObj, res[0]?.image ?? "");
  } catch (error) {
    console.error("[ERROR]: ", error);
    return await sendingMessage(
      baseUrl,
      msgObj,
      `Sorry, I couldn't get meme photo 🙁`
    );
  }
};

export const profileCommand = async (
  baseUrl: string,
  msgObj: IncomingRequest,
  token: string
) => {
  try {
    await sendingChatAction(baseUrl, msgObj, "upload_photo");
    const userProfile = await gettingUserProfilePhoto(baseUrl, msgObj, 0, 1);
    if (userProfile?.ok && userProfile?.result.total_count > 0) {
      const file_id = userProfile.result.photos[0]?.at(-1)?.file_id;
      if (!file_id) return;

      return await sendingPhoto(baseUrl, msgObj, file_id);
    } else {
      return await sendingMessage(
        baseUrl,
        msgObj,
        `Sorry, You've got no profile photo 🙁`
      );
    }
  } catch (error) {
    console.error("[ERROR]: ", error);
    return await sendingMessage(
      baseUrl,
      msgObj,
      `Sorry, I couldn't get user profile photo 🙁`
    );
  }
};

export const unknownCommand = async (
  baseUrl: string,
  msgObj: IncomingRequest
) => {
  return await sendingMessage(
    baseUrl,
    msgObj,
    `${msgObj.message.text}\n\nSorry, I didn't understand this 🙁\nType /help for all valid commands.`
  );
};
