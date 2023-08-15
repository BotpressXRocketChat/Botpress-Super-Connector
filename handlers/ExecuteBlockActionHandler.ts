import {
  IHttp,
  ILogger,
  IModify,
  IPersistence,
  IRead,
} from "@rocket.chat/apps-engine/definition/accessors";

import {
  IUIKitResponse,
  UIKitBlockInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";
import { ActionIdsPrefixes } from "../types/Types";
import { createBotUIFlow } from "../flows/CreateBot";
import { updateBotUIFlow } from "../flows/UpdateBot";
import { SEPARATOR } from "../config/BlocksConfig";
import { intitateConversationHandler } from "../flows/BotConverse";
import { deleteBotDBFlow } from "../flows/DeleteBot";
import { getChatThreadId } from "../helpers/Utility";

export const executeBlockActionHandler = async (
  context: UIKitBlockInteractionContext,
  read: IRead,
  http: IHttp,
  persistence: IPersistence,
  modify: IModify,
  appId: string,
  logger: ILogger
): Promise<IUIKitResponse> => {
  const data = context.getInteractionData();
  const { actionId } = data;

  try {
    switch (true) {
      case actionId.startsWith(ActionIdsPrefixes.CREATE_BOT):
        createBotUIFlow(context, read, persistence, modify, appId, logger);
        break;
      case actionId.startsWith(ActionIdsPrefixes.UPDATE_BOT):
        updateBotUIFlow(context, read, persistence, modify, appId, logger);
        break;
      case actionId.startsWith(ActionIdsPrefixes.DELETE_BOT):
        deleteBotDBFlow(context, read, persistence, modify, appId, logger);
        break;
      case actionId.startsWith(ActionIdsPrefixes.BOT_SINGLE_CHOICE):
        const { room, message } = data;
        if (!message?.id || !room) throw new Error("Invalid message or room");
        const botUsername = actionId.split("#")[2];

        const selectedChoice = actionId
          .split("#")[1]
          .split(SEPARATOR)
          .join(" ");

        await intitateConversationHandler(
          read,
          http,
          modify,
          appId,
          logger,
          botUsername,
          selectedChoice,
          room,
          getChatThreadId(message)
        );
        break;
    }
  } catch (error) {
    logger.info(error);
    return {
      success: false,
    };
  }

  return {
    success: true,
  };
};
