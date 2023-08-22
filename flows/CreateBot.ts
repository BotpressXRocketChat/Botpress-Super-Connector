import {
  ILogger,
  IModify,
  IPersistence,
  IRead,
} from "@rocket.chat/apps-engine/definition/accessors";

import {
  UIKitBlockInteractionContext,
  UIKitViewSubmitInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";
import { createUpdateBotModal } from "../ui_elements/modals/CreateUpdateBot";
import { createBotInsideDB } from "../db/Create";
import { extractDataFromViewModal } from "../helpers/Botpress";
import { Bot } from "../types/Types";
import { createDirectRoom, sendMessage } from "../helpers/Utility";

const createBotUIFlow = async (
  context: UIKitBlockInteractionContext,
  read: IRead,
  persistence: IPersistence,
  modify: IModify,
  appId: string,
  logger: ILogger
): Promise<void> => {
  const triggerId = context.getInteractionData().triggerId;
  const createBotModal = createUpdateBotModal(
    context,
    read,
    persistence,
    modify,
    appId,
    logger
  );

  await modify
    .getUiController()
    .openSurfaceView(
      createBotModal,
      { triggerId },
      context.getInteractionData().user
    );
};

const createBotDBFlow = async (
  context: UIKitViewSubmitInteractionContext,
  read: IRead,
  persistence: IPersistence,
  modify: IModify,
  logger: ILogger,
  appId: string
) => {
  const newBotData: Partial<Bot> = extractDataFromViewModal(context);

  await createBotInsideDB(persistence, modify, read, logger, newBotData, appId);

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
    `\Hurray\ \n Successfully created bot with username \${newBotData.username}\ `
  );
};

export { createBotUIFlow, createBotDBFlow };
