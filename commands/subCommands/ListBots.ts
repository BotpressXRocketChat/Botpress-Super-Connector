import {
  IModify,
  IRead,
  ILogger,
} from "@rocket.chat/apps-engine/definition/accessors";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";

import { LIST_BOT_CONFIG, BLOCK } from "../../config/BlocksConfig";
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
import {
  ActionIdsPrefixes,
  Bot,
  DANGER,
  MARK_DOWN,
  PLAIN_TEXT,
  PRIMARY,
} from "../../types/Types";
import { getAllBots } from "../../db/Read";
import { sendNotification } from "../../helpers/Utility";

export const listBotCommandExecutor = async (
  context: SlashCommandContext,
  read: IRead,
  modify: IModify,
  logger: ILogger,
  appId: string
): Promise<Array<Block>> => {
  const messageBlocks: Array<Block> = [];

  const data: Array<Bot> = await getAllBots(appId, read);

  const sectionBlock = getSectionBlock({
    appId,
    blockId: LIST_BOT_CONFIG["PRIMARY_TEXT"]["BLOCK_ID"],
    text: getTextObject({
      text: LIST_BOT_CONFIG["PRIMARY_TEXT"]["TEXT"],
      type: MARK_DOWN,
    }) as TextObject,
  });

  const botsBlocks: Array<ButtonElement> = data.map((bot): ButtonElement => {
    return getButtonBlock({
      appId,
      blockId: `${BLOCK}#${bot.botpressId}`,
      actionId: `${ActionIdsPrefixes.UPDATE_BOT}#${bot.botpressId}`,
      text: getTextObject({
        text: bot["username"],
        type: PLAIN_TEXT,
      }) as PlainText,
      value: bot["username"],
      style: DANGER,
    });
  });

  const botsActionBlock: ActionsBlock = getActionBlock({
    elements: botsBlocks,
  });

  const createButtonSectionElement = getSectionBlock({
    appId,
    text: getTextObject({
      text: LIST_BOT_CONFIG["CREATE_BUTTON"]["LABEL"],
      type: MARK_DOWN,
    }),
    accessory: getButtonBlock({
      appId,
      blockId: LIST_BOT_CONFIG["CREATE_BUTTON"]["BLOCK_ID"],
      actionId: LIST_BOT_CONFIG["CREATE_BUTTON"]["ACTION_ID"],
      text: getTextObject({
        text: LIST_BOT_CONFIG["CREATE_BUTTON"]["TEXT"],
        type: PLAIN_TEXT,
      }) as PlainText,
      value: LIST_BOT_CONFIG["CREATE_BUTTON"]["TEXT"],
      style: PRIMARY,
    }),
  });

  messageBlocks.push(sectionBlock, botsActionBlock, createButtonSectionElement);

  return messageBlocks;
};
