import {
  ILogger,
  IModify,
  IPersistence,
  IRead,
} from "@rocket.chat/apps-engine/definition/accessors";

import { IBotUser } from "@rocket.chat/apps-engine/definition/users/IBotUser";
import { IUser, UserType } from "@rocket.chat/apps-engine/definition/users";
import {
  RocketChatAssociationModel,
  RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";
import { Bot, CoreDBIdsPersistenceStorage } from "../types/Types";

export const deleteBotInsideDB = async (
  persistence: IPersistence,
  modify: IModify,
  read: IRead,
  logger: ILogger,
  deleteBotData: Partial<IBotUser>,
  appID: string
) => {
  try {
    const coreDdId = (deleteBotData as Bot).coreDdId;

    await persistence.remove(coreDdId);

    const botsCoreDBIdsAssociation = new RocketChatAssociationRecord(
      RocketChatAssociationModel.MISC,
      appID
    );

    let botsCoreDBIdsPersistence = (await read
      .getPersistenceReader()
      .readByAssociation(
        botsCoreDBIdsAssociation
      )) as CoreDBIdsPersistenceStorage[];

    let requiredAssociationData = botsCoreDBIdsPersistence[0].coreDBIDs.filter(
      (id) => !(id == coreDdId)
    );

    const updateBotsCoreDBIdsAssociation = new RocketChatAssociationRecord(
      RocketChatAssociationModel.MISC,
      appID
    );

    await persistence.updateByAssociation(
      updateBotsCoreDBIdsAssociation,
      requiredAssociationData,
      true
    );
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};
