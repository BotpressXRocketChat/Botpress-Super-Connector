import {
  ILogger,
  IModify,
  IPersistence,
  IRead,
  IUIKitSurfaceViewParam,
} from "@rocket.chat/apps-engine/definition/accessors";
import { UIKitSurfaceType } from "@rocket.chat/apps-engine/definition/uikit";

import { UIKitBlockInteractionContext } from "@rocket.chat/apps-engine/definition/uikit";
import {
  CREATE_UPDATE_BOT_MODAL_CONFIG,
  SEPARATOR,
} from "../../config/BlocksConfig";
import {
  getButtonBlock,
  getInputBlock,
  getPlainTextInputBlock,
  getTextObject,
} from "../Block";

import { Block, PlainText } from "@rocket.chat/ui-kit";
import { Bot, DANGER, PLAIN_TEXT, PRIMARY } from "../../types/Types";

export function createUpdateBotModal(
  context: UIKitBlockInteractionContext,
  read: IRead,
  persistence: IPersistence,
  modify: IModify,
  appId: string,
  existingBot?: Bot,
  logger?: ILogger
): IUIKitSurfaceViewParam {
  logger?.info(existingBot);
  const inputBlocks: Block[] = [];
  CREATE_UPDATE_BOT_MODAL_CONFIG["FIELDS"].map((field) => {
    const botProperty = field.ACTION_ID.split("#")?.[1];
    if (!botProperty) throw new Error("Invalid Config");
    if (existingBot && field["ACTION_ID"].includes("username")) return;

    inputBlocks.push(
      getInputBlock({
        label: getTextObject({
          type: PLAIN_TEXT,
          text: field.TEXT_LABEL,
        }) as PlainText,
        element: getPlainTextInputBlock({
          appId,
          blockId: field.BLOCK_ID,
          actionId: field.ACTION_ID,
          placeholder: getTextObject({
            type: PLAIN_TEXT,
            text: field.PLACE_HOLDER,
          }) as PlainText,
          initialValue: existingBot ? existingBot[botProperty] : "",
        }),
      })
    );
  });

  const closeButton = getButtonBlock({
    appId,
    blockId: CREATE_UPDATE_BOT_MODAL_CONFIG["CLOSE_BUTTON"].BLOCK_ID,
    actionId: CREATE_UPDATE_BOT_MODAL_CONFIG["CLOSE_BUTTON"].ACTION_ID,
    text: getTextObject({
      text: CREATE_UPDATE_BOT_MODAL_CONFIG["CLOSE_BUTTON"].TEXT,
      type: PLAIN_TEXT,
    }) as PlainText,
    value: CREATE_UPDATE_BOT_MODAL_CONFIG["CLOSE_BUTTON"].TEXT,
    style: DANGER,
  });

  const buttonType = existingBot ? "UPDATE_BUTTON" : "SAVE_BUTTON";

  const submitButton = getButtonBlock({
    appId,
    blockId: CREATE_UPDATE_BOT_MODAL_CONFIG[buttonType].BLOCK_ID,
    actionId: CREATE_UPDATE_BOT_MODAL_CONFIG[buttonType].ACTION_ID,
    text: getTextObject({
      text: CREATE_UPDATE_BOT_MODAL_CONFIG[buttonType].TEXT,
      type: PLAIN_TEXT,
    }) as PlainText,
    value: CREATE_UPDATE_BOT_MODAL_CONFIG[buttonType].TEXT,
    style: PRIMARY,
  });

  const viewId = existingBot
    ? `${CREATE_UPDATE_BOT_MODAL_CONFIG["UPDATE_VIEW_ID"]}${SEPARATOR}${existingBot.coreDdId}`
    : CREATE_UPDATE_BOT_MODAL_CONFIG["CREATE_VIEW_ID"];

  return {
    id: viewId,
    type: UIKitSurfaceType.MODAL,
    title: getTextObject({
      text: CREATE_UPDATE_BOT_MODAL_CONFIG["LABEL"],
      type: PLAIN_TEXT,
    }),
    close: closeButton,
    submit: submitButton,
    blocks: inputBlocks,
  };
}
