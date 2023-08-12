import {
  IHttp,
  IModify,
  IPersistence,
  IRead,
  ILogger,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
  ISlashCommand,
  SlashCommandContext,
} from "@rocket.chat/apps-engine/definition/slashcommands";

import { LIST_BOT_CONFIG, BLOCK } from "../config/BlocksConfig";
import { TEST_BOTS } from "../config/TestConfig";
import {
  getActionBlock,
  getButtonBlock,
  getSectionBlock,
  getTextObject,
} from "../ui_elements/Block";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
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
} from "../types/Types";
import { getAllBots } from "../db/Read";

export class ListBots implements ISlashCommand {
  public command = "list-bots";
  public i18nDescription = "";
  public providesPreview = false;
  public i18nParamsExample = "";
  public _logger: ILogger;
  public _appId: string;

  constructor(logger: ILogger, appId: string) {
    this._logger = logger;
    this._appId = appId;
  }

  public async executor(
    context: SlashCommandContext,
    read: IRead,
    modify: IModify,
    http: IHttp,
    persis: IPersistence
  ): Promise<void> {
    // const triggerId = context.getTriggerId() as string;
    const user = context.getSender();
    const room = context.getRoom();

    const appUser = (await read.getUserReader().getAppUser()) as IUser;

    const messageBlocks: Array<Block> = [];

    const data: Array<Bot> = await getAllBots(this._appId, read);

    this._logger.debug(data);

    const sectionBlock = getSectionBlock({
      appId: this._appId,
      blockId: LIST_BOT_CONFIG["PRIMARY_TEXT"]["BLOCK_ID"],
      text: getTextObject({
        text: LIST_BOT_CONFIG["PRIMARY_TEXT"]["TEXT"],
        type: MARK_DOWN,
      }) as TextObject,
    });

    const botsBlocks: Array<ButtonElement> = data.map((bot): ButtonElement => {
      return getButtonBlock({
        appId: this._appId,
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
      appId: this._appId,
      text: getTextObject({
        text: LIST_BOT_CONFIG["CREATE_BUTTON"]["LABEL"],
        type: MARK_DOWN,
      }),
      accessory: getButtonBlock({
        appId: this._appId,
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

    messageBlocks.push(
      sectionBlock,
      botsActionBlock,
      createButtonSectionElement
    );

    const msg = modify
      .getCreator()
      .startMessage()
      .setSender(appUser)
      .setRoom(room);

    msg.setBlocks(messageBlocks);

    return read.getNotifier().notifyUser(user, msg.getMessage());
  }
}
