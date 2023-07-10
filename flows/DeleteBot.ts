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

  const persistenceData: Array<Bot> = await getAllBots(appId, read);

  const botpressId = actionId.split("#")?.[1];

  let existingbOT: Bot | null = null;

  persistenceData.map((bot) => {
    if (bot.botpressId == botpressId) {
      existingbOT = bot;
    }
  });

  if (!existingbOT) return;

  await deleteBotInsideDB(
    persistence,
    modify,
    read,
    logger,
    existingbOT,
    appId
  );
};
