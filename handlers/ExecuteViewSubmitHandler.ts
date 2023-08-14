import {
  ILogger,
  IModify,
  IPersistence,
  IRead,
} from "@rocket.chat/apps-engine/definition/accessors";

import { UIKitViewSubmitInteractionContext } from "@rocket.chat/apps-engine/definition/uikit";
import { CREATE_UPDATE_BOT_MODAL_CONFIG } from "../config/BlocksConfig";
import { createBotDBFlow } from "../flows/CreateBot";
import { updateBotDBFlow } from "../flows/UpdateBot";

export const executeViewSubmitHandler = async (
  context: UIKitViewSubmitInteractionContext,
  read: IRead,
  persistence: IPersistence,
  modify: IModify,
  appId: string,
  logger: ILogger
): Promise<void> => {
  const { view } = context.getInteractionData();

  try {
    switch (true) {
      case view.id.startsWith(CREATE_UPDATE_BOT_MODAL_CONFIG.CREATE_VIEW_ID):
        await createBotDBFlow(
          context,
          read,
          persistence,
          modify,
          logger,
          appId
        );
        context.getInteractionResponder().successResponse();
        break;
      case view.id.startsWith(CREATE_UPDATE_BOT_MODAL_CONFIG.UPDATE_VIEW_ID):
        logger.info(view.id);
        await updateBotDBFlow(context, read, persistence, modify, logger);
        break;
      default:
        break;
    }
    logger.info("finished flow");
  } catch (error) {
    context.getInteractionResponder().viewErrorResponse({
      viewId: view.id,
      errors: error,
    });
  }
};
