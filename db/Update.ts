import {
  ILogger,
  IModify,
  IPersistence,
  IRead,
} from "@rocket.chat/apps-engine/definition/accessors";

import { IUser, UserType } from "@rocket.chat/apps-engine/definition/users";
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
  updatebotData: Bot
) => {
  try {
    console.log(updatebotData, "updatebotdata");
    const botUserCoreDB: IUser = await read
      .getUserReader()
      .getById((updatebotData as Bot).coreDdId);

    const x = await modify
      .getUpdater()
      .getUserUpdater()
      .updateCustomFields(botUserCoreDB, {
        username: (updatebotData as Bot).username,
      });

    logger.info(x, "modified");

    const updateBotAssociation = new RocketChatAssociationRecord(
      RocketChatAssociationModel.MISC,
      (updatebotData as Bot).coreDdId
    );

    logger.info(updateBotAssociation);

    await persistence.updateByAssociation(
      updateBotAssociation,
      updatebotData,
      true
    );
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};
