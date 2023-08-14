import { ILogger, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import {
  RocketChatAssociationModel,
  RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";
import { Bot, CoreDBIdsPersistenceStorage } from "../types/Types";
import {
  validateCoreDBIdsStorage,
  validateBots,
} from "../validator/DBResponse";

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
  read: IRead,
  logger?: ILogger
): Promise<Array<Bot>> => {
  const coreDBIDsdata = validateCoreDBIdsStorage(
    (await read
      .getPersistenceReader()
      .readByAssociation(
        new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, appId)
      )) as CoreDBIdsPersistenceStorage[]
  );

  const botsDBData: Array<Bot[]> = await Promise.all(
    coreDBIDsdata.coreDBIDs.map((id) => {
      return read
        .getPersistenceReader()
        .readByAssociation(
          new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, id)
        ) as Promise<Bot[]>;
    })
  );

  return validateBots(botsDBData);
};
