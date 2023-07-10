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
import { createBotInsideDB } from "../db/Create";
import { extractDataFromViewModal } from "../helpers/Botpress";
import { Bot } from "../types/Types";

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
    appId
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
  appID: string
) => {
  const newBotData: Partial<Bot> = extractDataFromViewModal(context);

  await createBotInsideDB(persistence, modify, read, logger, newBotData, appID);
};

export { createBotUIFlow, createBotDBFlow };
