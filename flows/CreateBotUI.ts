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
import { createBotInsideDB } from "../db/CreateBot";

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
  const { view } = context.getInteractionData();

  const newBotData: object = {};

  CREATE_UPDATE_BOT_MODAL_CONFIG.FIELDS.map(({ BLOCK_ID, ACTION_ID }) => {
    const key = ACTION_ID.split("#")[1];

    const value = view.state ? view.state[BLOCK_ID][ACTION_ID] : "";

    newBotData[key] = value;
  });

  await createBotInsideDB(persistence, modify, logger, newBotData, appID);
};

export { createBotUIFlow, createBotDBFlow };
