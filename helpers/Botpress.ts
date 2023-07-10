import { UIKitViewSubmitInteractionContext } from "@rocket.chat/apps-engine/definition/uikit";
import { CREATE_UPDATE_BOT_MODAL_CONFIG } from "../config/BlocksConfig";
import { Bot, ConverseResponse, ResponseType } from "../types/Types";

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
  context: UIKitViewSubmitInteractionContext
): Partial<Bot> => {
  const { view } = context.getInteractionData();
  const botData: object = {};

  CREATE_UPDATE_BOT_MODAL_CONFIG.FIELDS.map(({ BLOCK_ID, ACTION_ID }) => {
    const key = ACTION_ID.split("#")[1];

    const value = view.state ? view.state[BLOCK_ID][ACTION_ID] : "";

    botData[key] = value;
  });

  return botData as Bot;
};
