import type {
  BotCommand,
  ChatActionType,
  FileInfo,
  InputRichMessage,
  ITelegramClient,
  SentMessage,
  TelegramResponse,
  UserProfilePhotos,
} from "~~/types/api";
import { TELEGRAM_API_BASE } from "~~/shared/constants";

export class TelegramClient implements ITelegramClient {
  private baseUrl: string;

  constructor(private token: string) {
    this.baseUrl = `${TELEGRAM_API_BASE}${token}`;
  }

  async sendMessage(
    chatId: number,
    text: string,
    opts?: Record<string, unknown>,
  ): Promise<SentMessage | null> {
    try {
      const res = await $fetch<TelegramResponse<SentMessage>>(
        `${this.baseUrl}/sendMessage`,
        { method: "POST", body: { chat_id: chatId, text, ...opts } },
      );
      return res.result;
    } catch (error) {
      console.error("[TelegramClient.sendMessage]", error);
      return null;
    }
  }

  async sendPhoto(
    chatId: number,
    photo: string,
    opts?: Record<string, unknown>,
  ): Promise<SentMessage | null> {
    try {
      const res = await $fetch<TelegramResponse<SentMessage>>(
        `${this.baseUrl}/sendPhoto`,
        { method: "POST", body: { chat_id: chatId, photo, ...opts } },
      );
      return res.result;
    } catch (error) {
      console.error("[TelegramClient.sendPhoto]", error);
      return null;
    }
  }

  async sendChatAction(
    chatId: number,
    action: ChatActionType,
  ): Promise<boolean> {
    try {
      const res = await $fetch<TelegramResponse<true>>(
        `${this.baseUrl}/sendChatAction`,
        { method: "POST", body: { chat_id: chatId, action } },
      );
      return res.ok;
    } catch (error) {
      console.error("[TelegramClient.sendChatAction]", error);
      return false;
    }
  }

  async getUserProfilePhotos(
    userId: number,
    offset?: number,
    limit?: number,
  ): Promise<UserProfilePhotos | null> {
    try {
      const res = await $fetch<TelegramResponse<UserProfilePhotos>>(
        `${this.baseUrl}/getUserProfilePhotos`,
        { method: "POST", body: { user_id: userId, offset, limit } },
      );
      return res.result;
    } catch (error) {
      console.error("[TelegramClient.getUserProfilePhotos]", error);
      return null;
    }
  }

  async getFile(fileId: string): Promise<FileInfo | null> {
    try {
      const res = await $fetch<TelegramResponse<FileInfo>>(
        `${this.baseUrl}/getFile`,
        { method: "POST", body: { file_id: fileId } },
      );
      return res.result;
    } catch (error) {
      console.error("[TelegramClient.getFile]", error);
      return null;
    }
  }

  async sendRichMessage(
    chatId: number,
    richMessage: InputRichMessage,
    opts?: Record<string, unknown>,
  ): Promise<SentMessage | null> {
    try {
      const res = await $fetch<TelegramResponse<SentMessage>>(
        `${this.baseUrl}/sendRichMessage`,
        { method: "POST", body: { chat_id: chatId, rich_message: richMessage, ...opts } },
      );
      return res.result;
    } catch (error) {
      console.error("[TelegramClient.sendRichMessage]", error);
      return null;
    }
  }

  async setMyCommands(commands: BotCommand[]): Promise<boolean> {
    try {
      const res = await $fetch<TelegramResponse<true>>(
        `${this.baseUrl}/setMyCommands`,
        { method: "POST", body: { commands } },
      );
      return res.ok;
    } catch (error) {
      console.error("[TelegramClient.setMyCommands]", error);
      return false;
    }
  }
}
