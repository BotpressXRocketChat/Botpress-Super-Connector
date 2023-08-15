import {
  ILogger,
  IModify,
  IPersistence,
  IRead,
} from "@rocket.chat/apps-engine/definition/accessors";

import { UIKitBlockInteractionContext } from "@rocket.chat/apps-engine/definition/uikit";
import { Bot } from "../types/Types";
import { getAllBots } from "../db/Read";
import { deleteBotInsideDB } from "../db/Delete";
import { createDirectRoom, sendMessage } from "../helpers/Utility";
import { SEPARATOR } from "../config/BlocksConfig";

export const deleteBotDBFlow = async (
  context: UIKitBlockInteractionContext,
  read: IRead,
  persistence: IPersistence,
  modify: IModify,
  appId: string,
  logger: ILogger
): Promise<void> => {
  const data = context.getInteractionData();
  const { actionId } = data;

  const persistenceData: Array<Bot> = await getAllBots(appId, read, logger);

  const botpressUsername = actionId.split(SEPARATOR)?.[1];

  let existingBot: Bot | null = null;
  persistenceData?.map((bot) => {
    if (bot.username == botpressUsername) {
      existingBot = bot;
    }
  });

  if (!existingBot) return;

  await deleteBotInsideDB(
    persistence,
    modify,
    read,
    logger,
    existingBot,
    appId
  );

  const initialMessageSender = context.getInteractionData().user;
  if (!initialMessageSender) return;

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
    `Successfully deleted bot with username ${botpressUsername} from App's storage and deactivated the user`
  );
};
