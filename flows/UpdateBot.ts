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
import { CREATE_UPDATE_BOT_MODAL_CONFIG } from "../config/BlocksConfig";
import { updateBotInsideDB } from "../db/Update";
import { Bot } from "../types/Types";
import { getAllBots } from "../db/Read";
import { extractDataFromViewModal } from "../helpers/Botpress";

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

  const persistenceData: Array<Bot> = await getAllBots(appId, read);

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
    existingbOT
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
  const updateBotData: Partial<Bot> = extractDataFromViewModal(context);

  await updateBotInsideDB(persistence, modify, read, logger, updateBotData);
};

export { updateBotDBFlow, updateBotUIFlow };
