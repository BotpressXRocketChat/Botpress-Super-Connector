import {
  ILogger,
  IModify,
  IPersistence,
  IRead,
} from "@rocket.chat/apps-engine/definition/accessors";

import {
  IUIKitResponse,
  UIKitBlockInteractionContext,
  UIKitViewSubmitInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";
import { IBotUser } from "@rocket.chat/apps-engine/definition/users/IBotUser";
import { UserType } from "@rocket.chat/apps-engine/definition/users";
import { createUpdateBotModal } from "../ui_elements/modals/CreateUpdateBot";
import { CREATE_UPDATE_BOT_MODAL_CONFIG } from "../config/BlocksConfig";

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
  logger: ILogger
) => {
  const { view } = context.getInteractionData();

  const newBotData: object = {};

  CREATE_UPDATE_BOT_MODAL_CONFIG.FIELDS.map(({ BLOCK_ID, ACTION_ID }) => {
    const key = ACTION_ID.split("#")[1];

    const value = view.state ? view.state[BLOCK_ID][ACTION_ID] : "";

    newBotData[key] = value;
  });

  try {
    const newBot: Partial<IBotUser> = {
      username: newBotData["botpress_username"],
      type: UserType.BOT,
      isEnabled: true,
      name: newBotData["botpress_username"],
      roles: ["bot"],
    };

    const bot_builder_data = modify.getCreator().startBotUser(newBot);

    const bot = await modify.getCreator().finish(bot_builder_data);

    console.log(bot);
  } catch (error) {
    logger.error(error);
  }

  return;
  // modify.getCreator().startBotUser();
};

export { createBotUIFlow, createBotDBFlow };
