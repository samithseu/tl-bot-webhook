import {
  type GetFileResponse,
  type ChatActionType,
  type GetUserProfilePhotosResponse,
  type IncomingRequest,
  type OutgoingResponse,
} from "~~/types/api";
import { allCommands } from "~~/shared/utils/commands";

// LOGGING
export const logging = (msgObj: IncomingRequest) => {
  try {
    console.log(
      `[LOG]: "${msgObj.message.text}" by ${msgObj.message.from.username} (${
        msgObj.message.from.id
      }) at ${new Date(msgObj.message.date * 1000).toLocaleString()}`
    );
  } catch (error) {
    console.error("[ERROR]: ", error);
  }
};

// SETTING COMMANDS
export const settingMyCommands = async (baseUrl: string): Promise<boolean> => {
  try {
    // sending message
    return await $fetch<boolean>(`${baseUrl}/setMyCommands`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
      body: JSON.stringify({ commands: allCommands }),
    });
  } catch (error) {
    console.error("[ERROR]: ", error);
    return false;
  }
};

// SENDING MESSAGE
export const sendingMessage = async (
  baseUrl: string,
  msgObj: IncomingRequest,
  msg: string,
  msgOptions?: Object
): Promise<OutgoingResponse | null> => {
  try {
    // sending message
    return await $fetch<OutgoingResponse>(`${baseUrl}/sendMessage`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        chat_id: msgObj.message.chat.id,
        text: msg,
        ...msgOptions,
      }),
    });
  } catch (error) {
    console.error("[ERROR]: ", error);
    return null;
  }
};

// SENDING PHOTO
export const sendingPhoto = async (
  baseUrl: string,
  msgObj: IncomingRequest,
  photo: string,
  photoOptions?: Object
): Promise<OutgoingResponse | null> => {
  try {
    // $fetch automatically stringifies the body and sets content-type
    return await $fetch<OutgoingResponse>(`${baseUrl}/sendPhoto`, {
      method: "POST",
      body: {
        chat_id: msgObj.message.chat.id,
        photo: photo,
        ...photoOptions,
      },
    });
  } catch (error) {
    console.error("[ERROR]: ", error);
    return null;
  }
};

// SENDING CHAT ACTION
export const sendingChatAction = async (
  baseUrl: string,
  msgObj: IncomingRequest,
  action: ChatActionType
): Promise<boolean> => {
  try {
    return await $fetch<boolean>(`${baseUrl}/sendChatAction`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        chat_id: msgObj.message.chat.id,
        action: action,
      }),
    });
  } catch (error) {
    console.error("[ERROR]: ", error);
    return false;
  }
};

// GETTING USER PROFILE PHOTO
export const gettingUserProfilePhoto = async (
  baseUrl: string,
  msgObj: IncomingRequest,
  offset?: number,
  limit?: number
): Promise<GetUserProfilePhotosResponse | null> => {
  try {
    return await $fetch<GetUserProfilePhotosResponse>(
      `${baseUrl}/getUserProfilePhotos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user_id: msgObj.message.from.id,
          offset,
          limit,
        }),
      }
    );
  } catch (error) {
    console.error("[ERROR]: ", error);
    return null;
  }
};

// GETTING FILE
export const gettingFile = async (baseUrl: string, file_id: string) => {
  try {
    return await $fetch<GetFileResponse>(`${baseUrl}/getFile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ file_id: file_id }),
    });
  } catch (error) {
    console.error("[ERROR]: ", error);
    return null;
  }
};
