import {
  IModify,
  IPersistence,
  IRead,
  IUIKitSurfaceViewParam,
} from "@rocket.chat/apps-engine/definition/accessors";
import { UIKitSurfaceType } from "@rocket.chat/apps-engine/definition/uikit";

import { UIKitBlockInteractionContext } from "@rocket.chat/apps-engine/definition/uikit";
import { CREATE_UPDATE_BOT_MODAL_CONFIG } from "../../config/BlocksConfig";
import {
  getButtonBlock,
  getInputBlock,
  getPlainTextInputBlock,
  getTextObject,
} from "../Block";

import { Block, PlainText } from "@rocket.chat/ui-kit";
import { DANGER, PLAIN_TEXT, PRIMARY } from "../../types/Types";

export function createUpdateBotModal(
  context: UIKitBlockInteractionContext,
  read: IRead,
  persistence: IPersistence,
  modify: IModify,
  appId: string
): IUIKitSurfaceViewParam {
  const inputBlocks: Block[] = CREATE_UPDATE_BOT_MODAL_CONFIG["FIELDS"].map(
    (field) => {
      return getInputBlock({
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
          initialValue: "",
        }),
      });
    }
  );

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

  const submitButton = getButtonBlock({
    appId,
    blockId: CREATE_UPDATE_BOT_MODAL_CONFIG["SAVE_BUTTON"].BLOCK_ID,
    actionId: CREATE_UPDATE_BOT_MODAL_CONFIG["SAVE_BUTTON"].ACTION_ID,
    text: getTextObject({
      text: CREATE_UPDATE_BOT_MODAL_CONFIG["SAVE_BUTTON"].TEXT,
      type: PLAIN_TEXT,
    }) as PlainText,
    value: CREATE_UPDATE_BOT_MODAL_CONFIG["SAVE_BUTTON"].TEXT,
    style: PRIMARY,
  });

  return {
    id: CREATE_UPDATE_BOT_MODAL_CONFIG["CREATE_VIEW_ID"],
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
