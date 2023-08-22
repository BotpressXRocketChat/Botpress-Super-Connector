import {
  IModify,
  IRead,
  ILogger,
} from "@rocket.chat/apps-engine/definition/accessors";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";

import { HELP_CONFIG } from "../../config/BlocksConfig";
import { getSectionBlock, getTextObject } from "../../ui_elements/Block";
import { Block, TextObject } from "@rocket.chat/ui-kit";
import { MARK_DOWN } from "../../types/Types";

export const helpCommandExecutor = (
  context: SlashCommandContext,
  read: IRead,
  modify: IModify,
  logger: ILogger,
  appId: string
): Array<Block> => {
  const messageBlocks: Array<Block> = [
    getSectionBlock({
      appId,
      blockId: HELP_CONFIG["PRIMARY_TEXT"]["BLOCK_ID"],
      text: getTextObject({
        text: HELP_CONFIG["PRIMARY_TEXT"]["TEXT"],
        type: MARK_DOWN,
      }) as TextObject,
    }),
  ];

  HELP_CONFIG["BODY"].map((option) => {
    messageBlocks.push(
      getSectionBlock({
        appId,
        blockId: option["BLOCK_ID"],
        text: getTextObject({
          text: option["TEXT"],
          type: MARK_DOWN,
        }) as TextObject,
      })
    );
  });

  return messageBlocks;
};
