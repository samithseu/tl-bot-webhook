export interface IncomingRequest {
  update_id: number;
  message?: IncomingMessage;
}

export interface IncomingMessage {
  message_id: number;
  from: User;
  chat: Chat;
  date: number;
  text?: string;
}

export interface User {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  language_code: string;
  is_premium: boolean;
}

export interface Chat {
  id: number;
  first_name: string;
  username: string;
  type: string;
}

export interface ValidatedMessage {
  message_id: number;
  from: User;
  chat: Chat;
  date: number;
  text: string;
}

export interface TelegramResponse<T> {
  ok: boolean;
  result: T;
}

export type SetMyCommandsResult = true;
export type SendChatActionResult = true;

export interface SentMessage {
  message_id: number;
  from: User;
  chat: Chat;
  date: number;
  text: string;
}

export interface UserProfilePhotos {
  total_count: number;
  photos: Array<
    {
      file_id: string;
      file_unique_id: string;
      file_size: number;
      width: number;
      height: number;
    }[]
  >;
}

export interface FileInfo {
  file_id: string;
  file_unique_id: string;
  file_size: number;
  file_path: string;
}

export type ChatActionType =
  | "upload_photo"
  | "record_video"
  | "upload_video"
  | "record_voice"
  | "upload_voice"
  | "upload_document"
  | "choose_sticker"
  | "find_location"
  | "record_video_note"
  | "upload_video_note"
  | "typing";

export interface BotCommand {
  command: string;
  description: string;
}

export interface ITelegramClient {
  sendMessage(
    chatId: number,
    text: string,
    opts?: Record<string, unknown>,
  ): Promise<SentMessage | null>;
  sendPhoto(
    chatId: number,
    photo: string,
    opts?: Record<string, unknown>,
  ): Promise<SentMessage | null>;
  sendChatAction(chatId: number, action: ChatActionType): Promise<boolean>;
  getUserProfilePhotos(
    userId: number,
    offset?: number,
    limit?: number,
  ): Promise<UserProfilePhotos | null>;
  getFile(fileId: string): Promise<FileInfo | null>;
  setMyCommands(commands: BotCommand[]): Promise<boolean>;
}

export interface MemeType {
  id: number;
  created: Date;
  modified: Date;
  image: string;
  tags: null;
  upvotes: number;
  downvotes: number;
}

export interface JokeType {
  error: boolean;
  category: string;
  type: string;
  setup: string;
  delivery: string;
  flags: {
    nsfw: boolean;
    religious: boolean;
    political: boolean;
    racist: boolean;
    sexist: boolean;
    explicit: boolean;
  };
  safe: boolean;
  id: number;
  lang: string;
}

export interface AIResponseType {
  id: string;
  choices: {
    finish_reason: string;
    native_finish_reason: string;
    message: {
      role: string;
      content: string;
    };
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
}
