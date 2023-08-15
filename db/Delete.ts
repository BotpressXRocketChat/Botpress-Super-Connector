import {
  ILogger,
  IModify,
  IPersistence,
  IRead,
} from "@rocket.chat/apps-engine/definition/accessors";

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
  deleteBotData: Bot,
  appId: string
) => {
  try {
    const deleteBotAssociation = new RocketChatAssociationRecord(
      RocketChatAssociationModel.MISC,
      deleteBotData.coreDdId
    );

    await modify
      .getUpdater()
      .getUserUpdater()
      .deactivate(deleteBotData.coreDdId, true);

    await persistence.removeByAssociation(deleteBotAssociation);

    const botsCoreDBIdsAssociation = new RocketChatAssociationRecord(
      RocketChatAssociationModel.MISC,
      appId
    );

    let botsCoreDBIdsPersistence = (await read
      .getPersistenceReader()
      .readByAssociation(
        botsCoreDBIdsAssociation
      )) as CoreDBIdsPersistenceStorage[];

    let requiredAssociationData = botsCoreDBIdsPersistence[0].coreDBIDs.filter(
      (id) => !(id == deleteBotData.coreDdId)
    );

    const updateBotsCoreDBIdsAssociation = new RocketChatAssociationRecord(
      RocketChatAssociationModel.MISC,
      appId
    );

    await persistence.updateByAssociation(
      updateBotsCoreDBIdsAssociation,
      {
        coreDBIDs: requiredAssociationData,
      },
      true
    );
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};
