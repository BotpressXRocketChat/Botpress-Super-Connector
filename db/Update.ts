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
import { Bot } from "../types/Types";

export const updateBotInsideDB = async (
  persistence: IPersistence,
  modify: IModify,
  read: IRead,
  logger: ILogger,
  updatebotData: Partial<Bot>
): Promise<Bot> => {
  try {
    const reqBotAssociation = new RocketChatAssociationRecord(
      RocketChatAssociationModel.MISC,
      (updatebotData as Bot).coreDdId
    );

    let [persistenceData] = await persistence.removeByAssociation(
      reqBotAssociation
    );

    if (!persistenceData) {
      throw new Error("User not found");
    }

    persistenceData = {
      ...persistenceData,
      ...updatebotData,
    };

    await persistence.updateByAssociation(
      reqBotAssociation,
      persistenceData,
      true
    );

    return persistenceData as Bot;
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};
