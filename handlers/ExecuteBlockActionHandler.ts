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
import { createBotUIFlow } from "../flows/CreateBotUI";
// import { updateBotUIFlow } from "../flows/UpdateBotUI";
import { deleteBotFlow } from "../flows/DeleteBotUI";
// import { updateBotFlow } from "../flows/UpdateBot";
// import { getAllBots } from "../db/ReadBot";

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
      // const data = await getAllBots(appID, read);
      logger.info(data);
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
