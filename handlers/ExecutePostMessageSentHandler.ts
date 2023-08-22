import {
  IHttp,
  ILogger,
  IModify,
  IPersistence,
  IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IMessage } from "@rocket.chat/apps-engine/definition/messages";
import { intitateConversationHandler } from "../flows/BotConverse";
import {
  createDirectRoom,
  getChatThreadId,
  sendMessage,
} from "../helpers/Utility";
import { RoomType } from "@rocket.chat/apps-engine/definition/rooms";
import { ILivechatRoom } from "@rocket.chat/apps-engine/definition/livechat";
import { Bot } from "../types/Types";
import { getBotsByUsername } from "../db/Read";

export const executePostMessageSentHandler = async (
  message: IMessage,
  read: IRead,
  http: IHttp,
  persistence: IPersistence,
  modify: IModify,
  appId: string,
  logger: ILogger
): Promise<void> => {
  const { text, room, sender } = message;

  if (!text) return;

  const reqThreadId = getChatThreadId(message);

  let botUsername: string = "";

  switch (room.type) {
    case RoomType.LIVE_CHAT:
      const { servedBy } = room as ILivechatRoom;

      if (!servedBy) return;

      botUsername = servedBy.username;
      break;

    case RoomType.DIRECT_MESSAGE:
      const paricipantsIds = room.userIds;

      if (!paricipantsIds) return;

      const dbData = await getBotsByUsername(read, paricipantsIds);

      if (!dbData.length) {
        logger.info("No bot in room to chat");
        return;
      }

      if (dbData.length > 1) throw new Error("More than one bot in room");

      botUsername = (dbData[0] as Bot).username;
      break;

    default:
      botUsername = text
        ?.split(" ")
        .filter((t) => t.startsWith("@"))?.[0]
        ?.slice(1);
  }

  // To stop the infinite loop
  if (sender.username === botUsername) return;

  if (!botUsername) return;

  const filteredText = text
    .split(" ")
    .filter((word) => !word.startsWith("@"))
    .join(" ");

  try {
    await intitateConversationHandler(
      read,
      http,
      modify,
      appId,
      logger,
      botUsername,
      filteredText,
      room,
      reqThreadId
    );
  } catch (error) {
    const initialMessageSender = message.sender;

    const sender = await read.getUserReader().getAppUser();

    if (!sender) return;

    const directChatRoom = await createDirectRoom(
      read,
      modify,
      sender,
      initialMessageSender
    );

    if (!directChatRoom) return;

    await sendMessage(
      modify,
      directChatRoom,
      sender,
      `Issue while conversating with ${botUsername} bot, Please check the scope of the bot or check if the botpress is available`
    );
  }

  return;
};
