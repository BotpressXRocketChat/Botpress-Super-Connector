import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { AppRoomType, Bot, Response, ResponseType } from "../types/Types";
import {
  ILogger,
  IMessageBuilder,
  IModify,
  IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom, RoomType } from "@rocket.chat/apps-engine/definition/rooms";
import {
  getActionBlock,
  getButtonBlock,
  getTextObject,
} from "../ui_elements/Block";
import { BLOCK, SEPARATOR } from "../config/BlocksConfig";
import { ActionIdsPrefixes, PLAIN_TEXT, PRIMARY, Choice } from "../types/Types";
import { PlainText, ButtonElement, Block } from "@rocket.chat/ui-kit";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { IMessage } from "@rocket.chat/apps-engine/definition/messages";

export const createDirectRoom = async (
  read: IRead,
  modify: IModify,
  sender: IUser,
  receiver: IUser
): Promise<IRoom | undefined> => {
  const usernames = [sender.username, receiver.username];
  let room: IRoom;
  try {
    room = await read.getRoomReader().getDirectByUsernames(usernames);
  } catch (error) {
    return;
  }

  if (room) {
    return room;
  } else {
    let roomId: string;

    // Create direct room between botUser and username
    const roomBuilder = modify
      .getCreator()
      .startRoom()
      .setType(RoomType.DIRECT_MESSAGE)
      .setCreator(sender)
      .setMembersToBeAddedByUsernames(usernames);
    roomId = await modify.getCreator().finish(roomBuilder);
    return await read.getRoomReader().getById(roomId);
  }
};

export const sendMessage = async (
  modify: IModify,
  room: IRoom,
  sender: IUser,
  text: string,
  messageBlocks?: Array<Block>,
  threadId?: string,
  logger?: ILogger
) => {
  let msg: IMessageBuilder = modify.getCreator().startMessage();

  if (text) msg.setText(text);

  if (messageBlocks) msg.setBlocks(messageBlocks);

  msg.setSender(sender).setRoom(room);

  if (threadId) msg.setThreadId(threadId);

  await modify.getCreator().finish(msg);
};

export const sendNotification = async (
  context: SlashCommandContext,
  modify: IModify,
  read: IRead,
  messageBlocks: Array<Block>
) => {
  const appUser = (await read.getUserReader().getAppUser()) as IUser;
  const room = context.getRoom();
  const user = context.getSender();

  const msg = modify
    .getCreator()
    .startMessage()
    .setSender(appUser)
    .setRoom(room);

  msg.setBlocks(messageBlocks);

  return read.getNotifier().notifyUser(user, msg.getMessage());
};

export const conversate = async (
  modify: IModify,
  responseData: Response,
  botUserCoreDB: IUser,
  botUserPersistence: Bot,
  room: IRoom,
  appId: string,
  logger: ILogger,
  threadId?: string
): Promise<void> => {
  const messageBlocks: Array<Block> = [];
  switch (responseData.type) {
    case ResponseType.SINGLE_CHOICE:
      const optionsBlocks: Array<ButtonElement> = (
        responseData.choices as Choice[]
      ).map((choice) => {
        const actionIdsuffix = choice.title.split(" ").join(SEPARATOR);
        return getButtonBlock({
          appId: appId,
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

      messageBlocks.push(
        getActionBlock({
          elements: optionsBlocks,
        })
      );
  }

  await sendMessage(
    modify,
    room,
    botUserCoreDB,
    responseData.text,
    messageBlocks,
    threadId,
    logger
  );
};

export const getChatSession = (room: IRoom, threadId: string): string => {
  switch (room.type) {
    case RoomType.CHANNEL:
      return threadId;

    default:
      return room.id;
  }
};

export const getChatThreadId = (message: IMessage): string | undefined => {
  const { room, id, threadId } = message;
  let requiredThreadId: string | undefined = "";

  switch (room.type) {
    case RoomType.CHANNEL:
      requiredThreadId = threadId || id;

    default:
      break;
  }

  return requiredThreadId;
};

export const reverseRoomTypeMapper = (type: string) => {
  switch (type) {
    case RoomType.CHANNEL:
      return AppRoomType.CHANNEL;
    case RoomType.DIRECT_MESSAGE:
      return AppRoomType.DIRECT_CHAT;
    case RoomType.LIVE_CHAT:
      return AppRoomType.DIRECT_CHAT;
    default:
      throw new Error("Invalid room type");
  }
};
