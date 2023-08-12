import { UIKitViewSubmitInteractionContext } from "@rocket.chat/apps-engine/definition/uikit";
import { ACTION } from "../config/BlocksConfig";
import { Bot, ConverseResponse, ResponseType } from "../types/Types";
import { ILogger } from "@rocket.chat/apps-engine/definition/accessors";

export const getConverseAPIRequestContent = (text: string) => {
  return {
    headers: {
      "Content-Type": "application/json",
    },
    data: { text },
  };
};

export const generateServiceUnavailableMessage = (
  botData: Bot
): ConverseResponse => {
  return {
    responses: [
      {
        type: ResponseType.TEXT,
        workflow: {},
        text: botData.unavailableMessage,
        typing: false,
      },
    ],
  };
};

export const extractDataFromViewModal = (
  context: UIKitViewSubmitInteractionContext,
  logger?: ILogger
): Partial<Bot> => {
  const { view } = context.getInteractionData();
  if (!view.state) return {};

  return Object.values(view.state)
    .map((innerObject) =>
      Object.entries(innerObject)
        .filter(([key]) => key.startsWith(`${ACTION}#`))
        .reduce((result, [actionId, value]) => {
          const cleanActionId = actionId.replace(`${ACTION}#`, "");
          result[cleanActionId] = value;
          return result;
        }, {})
    )
    .reduce(
      (result, actionObject) => Object.assign(result, actionObject),
      {}
    ) as Bot;
};
