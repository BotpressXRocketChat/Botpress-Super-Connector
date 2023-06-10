import {
  IAppAccessors,
  IConfigurationExtend,
  IHttp,
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
import { CREATE_UPDATE_BOT_MODAL_CONFIG } from "../config/BlocksConfig";
import { createBotDBFlow } from "../flows/CreateBot";

export const executeViewSubmitHandler = async (
  context: UIKitViewSubmitInteractionContext,
  read: IRead,
  persistence: IPersistence,
  modify: IModify,
  logger: ILogger
): Promise<void> => {
  const { view } = context.getInteractionData();

  try {
    switch (view.id) {
      case CREATE_UPDATE_BOT_MODAL_CONFIG.CREATE_VIEW_ID:
        await createBotDBFlow(context, read, persistence, modify, logger);
        context.getInteractionResponder().successResponse();
      case CREATE_UPDATE_BOT_MODAL_CONFIG.UPDATE_VIEW_ID:
        // await createBotDBFlow(context, read, persistence, modify);
        // context.getInteractionResponder().successResponse();
        break;
      default:
        break;
    }
  } catch (error) {
    context.getInteractionResponder().viewErrorResponse({
      viewId: view.id,
      errors: error,
    });
  }
};
