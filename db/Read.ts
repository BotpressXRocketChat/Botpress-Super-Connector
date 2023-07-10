import {
  IPersistence,
  IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
  RocketChatAssociationModel,
  RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";
import { Bot, CoreDBIdsPersistenceStorage } from "../types/Types";

export const getBotByBotpressId = async (
  appId: string,
  read: IRead,
  botpressId: string
): Promise<Array<object>> => {
  const data = await read
    .getPersistenceReader()
    .readByAssociation(
      new RocketChatAssociationRecord(
        RocketChatAssociationModel.MISC,
        botpressId
      )
    );

  return data;
};

export const getAllBots = async (
  appId: string,
  read: IRead
): Promise<Array<Bot>> => {
  const coreDBIDsdata = (await read
    .getPersistenceReader()
    .readByAssociation(
      new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, appId)
    )) as CoreDBIdsPersistenceStorage[];

  if (!coreDBIDsdata) return [];

  const coreDBIDs = coreDBIDsdata[0].coreDBIDs;

  const data: Bot[] = [];

  for (let idx = 0; idx < coreDBIDs.length; idx++) {
    let botData = (await read
      .getPersistenceReader()
      .readByAssociation(
        new RocketChatAssociationRecord(
          RocketChatAssociationModel.MISC,
          coreDBIDs[idx]
        )
      )) as Bot[];

    botData ? data.push(botData[0]) : null;
  }

  return data;
};
