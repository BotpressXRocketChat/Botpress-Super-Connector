import {
  IHttp,
  ILogger,
  IModify,
  IPersistence,
  IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IMessage } from "@rocket.chat/apps-engine/definition/messages";
import { intitateConversationHandler } from "../flows/BotConverse";
import { getChatThreadId } from "../helpers/Utility";

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

  return;
};
