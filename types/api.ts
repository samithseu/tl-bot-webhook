export interface IncomingRequest {
  update_id: number;
  message?: Message;
}

interface Message {
  message_id: number;
  from: {
    id: number;
    is_bot: boolean;
    first_name: string;
    username: string;
    language_code: string;
    is_premium: boolean;
  };
  chat: {
    id: number;
    first_name: string;
    username: string;
    type: string;
  };
  date: number;
  text?: string;
}

export interface OutgoingResponse {
  ok: boolean;
  result: Result;
}

interface Result {
  message_id: number;
  from: Chat;
  chat: Chat;
  date: number;
  text: string;
}

interface Chat {
  id: number;
  first_name: string;
  username: string;
  type?: string;
  is_bot?: boolean;
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

export interface GetUserProfilePhotosResponse {
  ok: boolean;
  result: {
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
  };
}

export interface GetFileResponse {
  ok: boolean;
  result: {
    file_id: string;
    file_unique_id: string;
    file_size: number;
    file_path: string;
  };
}
