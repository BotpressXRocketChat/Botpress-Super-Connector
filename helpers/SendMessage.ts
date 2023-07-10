import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { Bot, Response, ResponseType } from "../types/Types";
// import {} from
import {
  ILogger,
  IMessageBuilder,
  IModify,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { IMessage } from "@rocket.chat/apps-engine/definition/messages";
import {
  getActionBlock,
  getButtonBlock,
  getSectionBlock,
  getTextObject,
} from "../ui_elements/Block";
import { BLOCK, SEPARATOR } from "../config/BlocksConfig";
import { ActionIdsPrefixes, PLAIN_TEXT, PRIMARY, Choice } from "../types/Types";
import { PlainText, ButtonElement, ActionsBlock } from "@rocket.chat/ui-kit";

export const sendMessage = async (
  modify: IModify,
  responseData: Response,
  botUserCoreDB: IUser,
  botUserPersistence: Bot,
  room: IRoom,
  threadId: string,
  appID: string,
  logger: ILogger
): Promise<void> => {
  let msg: IMessageBuilder = modify.getCreator().startMessage();

  switch (responseData.type) {
    case ResponseType.SINGLE_CHOICE:
      const optionsBlocks: Array<ButtonElement> = (
        responseData.choices as Choice[]
      ).map((choice) => {
        const actionIdsuffix = choice.title.split(" ").join(SEPARATOR);
        return getButtonBlock({
          appId: appID,
          blockId: `${BLOCK}#${actionIdsuffix}`,
          actionId: `${ActionIdsPrefixes.BOT_SINGLE_CHOICE}#${actionIdsuffix}#${botUserPersistence.username}`,
          text: getTextObject({
            text: choice.title,
            type: PLAIN_TEXT,
          }) as PlainText,
          value: choice.value,
          style: PRIMARY,
        });
      });

      const optionsActionBlock: ActionsBlock = getActionBlock({
        elements: optionsBlocks,
      });

      msg.setBlocks([optionsActionBlock]);

    default:
      msg.setText(responseData.text);
  }

  msg.setSender(botUserCoreDB).setRoom(room).setThreadId(threadId);

  await modify.getCreator().finish(msg);
};
