import {
  IModify,
  IRead,
  ILogger,
} from "@rocket.chat/apps-engine/definition/accessors";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";

import { DELETE_BOT_CONFIG, SEPARATOR } from "../../config/BlocksConfig";
import {
  getActionBlock,
  getButtonBlock,
  getSectionBlock,
  getTextObject,
} from "../../ui_elements/Block";
import {
  Block,
  TextObject,
  ButtonElement,
  PlainText,
  ActionsBlock,
} from "@rocket.chat/ui-kit";
import { DANGER, MARK_DOWN, PLAIN_TEXT } from "../../types/Types";
import { sendNotification } from "../../helpers/Utility";

export const deleteBotCommandExecutor = async (
  context: SlashCommandContext,
  read: IRead,
  modify: IModify,
  logger: ILogger,
  appId: string
): Promise<void> => {
  // const triggerId = context.getTriggerId() as string;
  const [_, botUsername] = context.getArguments();

  const messageBlocks: Array<Block> = [];

  if (!botUsername) {
    messageBlocks.push(
      getSectionBlock({
        appId,
        blockId: DELETE_BOT_CONFIG["INVALID_PROMPT"]["BLOCK_ID"],
        text: getTextObject({
          text: `${DELETE_BOT_CONFIG["INVALID_PROMPT"]["TEXT"]}`,
          type: MARK_DOWN,
        }) as TextObject,
      })
    );

    await sendNotification(context, modify, read, messageBlocks);

    return;
  }

  const confirmationMessage = getSectionBlock({
    appId,
    blockId: DELETE_BOT_CONFIG["PRIMARY_TEXT"]["BLOCK_ID"],
    text: getTextObject({
      text: `${DELETE_BOT_CONFIG["PRIMARY_TEXT"]["TEXT"]} with user name @${botUsername}`,
      type: MARK_DOWN,
    }) as TextObject,
  });

  const deleteButton: ButtonElement = getButtonBlock({
    appId,
    blockId: DELETE_BOT_CONFIG["DELETE_BUTTON"]["BLOCK_ID"],
    actionId: `${DELETE_BOT_CONFIG["DELETE_BUTTON"]["ACTION_ID"]}${SEPARATOR}${botUsername}`,
    text: getTextObject({
      text: DELETE_BOT_CONFIG["DELETE_BUTTON"]["TEXT"],
      type: PLAIN_TEXT,
    }) as PlainText,
    value: DELETE_BOT_CONFIG["DELETE_BUTTON"]["TEXT"],
    style: DANGER,
  });

  const deleteButtonActionBlock: ActionsBlock = getActionBlock({
    elements: [deleteButton],
  });

  messageBlocks.push(confirmationMessage, deleteButtonActionBlock);

  await sendNotification(context, modify, read, messageBlocks);
};
