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

export const executePostMessageSentHandler = async (
  message: IMessage,
  read: IRead,
  http: IHttp,
  persistence: IPersistence,
  modify: IModify,
  appId: string,
  logger: ILogger
): Promise<void> => {
  const { text, room } = message;

  if (!text) return;

  const reqThreadId = getChatThreadId(message);

  const botUsername = text
    ?.split(" ")
    .filter((t) => t.startsWith("@"))?.[0]
    ?.slice(1);

  if (!botUsername) return;

  const filteredText = text
    .split(" ")
    .filter((word) => !word.startsWith("@"))
    .join(" ");

  logger.info(filteredText);

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
