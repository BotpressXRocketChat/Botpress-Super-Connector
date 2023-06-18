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
import { ActionIdsPrefixes } from "../types/Types";
import { createBotUIFlow } from "../flows/CreateBot";
import { deleteBotFlow } from "../flows/DeleteBot";
// import { updateBotFlow } from "../flows/UpdateBot";

export const executeBlockActionHandler = async (
  context: UIKitBlockInteractionContext,
  read: IRead,
  http: IHttp,
  persistence: IPersistence,
  modify: IModify,
  appID: string,
  logger: ILogger
): Promise<IUIKitResponse> => {
  const data = context.getInteractionData();
  const { actionId, user } = data;

  try {
    if (actionId.startsWith(ActionIdsPrefixes.CREATE_BOT)) {
      createBotUIFlow(context, read, persistence, modify, appID, logger);
    } else if (actionId.startsWith(ActionIdsPrefixes.UPDATE_BOT)) {
      //   updateBotUIFlow(context, read, persistence, modify, appID, logger);
      //   break;
    } else if (actionId.startsWith(ActionIdsPrefixes.DELETE_BOT)) {
      deleteBotFlow();
    }
  } catch (error) {
    return {
      success: false,
    };
  }

  return {
    success: true,
  };
};
