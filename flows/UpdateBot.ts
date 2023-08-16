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
import { SEPARATOR } from "../config/BlocksConfig";
import { updateBotInsideDB } from "../db/Update";
import { Bot } from "../types/Types";
import { getAllBots } from "../db/Read";
import { extractDataFromViewModal } from "../helpers/Botpress";
import { createDirectRoom, sendMessage } from "../helpers/Utility";

const updateBotUIFlow = async (
  context: UIKitBlockInteractionContext,
  read: IRead,
  persistence: IPersistence,
  modify: IModify,
  appId: string,
  logger: ILogger
): Promise<void> => {
  const triggerId = context.getInteractionData().triggerId;

  const data = context.getInteractionData();

  const { actionId } = data;

  const persistenceData: Array<Bot> = await getAllBots(appId, read, logger);

  const botpressId = actionId.split("#")?.[1];

  let existingbOT: Bot | null = null;

  persistenceData.map((bot) => {
    if (bot.botpressId == botpressId) {
      existingbOT = bot;
    }
  });

  if (!existingbOT) return;

  const createBotModal = createUpdateBotModal(
    context,
    read,
    persistence,
    modify,
    appId,
    logger,
    existingbOT,
  );

  await modify
    .getUiController()
    .openSurfaceView(
      createBotModal,
      { triggerId },
      context.getInteractionData().user
    );
};

const updateBotDBFlow = async (
  context: UIKitViewSubmitInteractionContext,
  read: IRead,
  persistence: IPersistence,
  modify: IModify,
  logger: ILogger
) => {
  let updateBotData: Partial<Bot> = extractDataFromViewModal(context, logger);
  const { view } = context.getInteractionData();

  const updatedBotData = await updateBotInsideDB(
    persistence,
    modify,
    read,
    logger,
    {
      ...updateBotData,
      coreDdId: view.id.split(SEPARATOR)[1],
    } as Bot
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
    `Successfully updated bot with username ${updatedBotData.username}`
  );
};

export { updateBotDBFlow, updateBotUIFlow };
