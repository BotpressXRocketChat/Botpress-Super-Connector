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
import { Bot } from "../types/Types";

export const updateBotInsideDB = async (
  persistence: IPersistence,
  modify: IModify,
  read: IRead,
  logger: ILogger,
  updatebotData: Partial<IBotUser>
) => {
  try {
    const botUserCoreDB: IUser = await read
      .getUserReader()
      .getById((updatebotData as Bot).coreDdId);

    await modify
      .getUpdater()
      .getUserUpdater()
      .updateCustomFields(botUserCoreDB, {
        username: (updatebotData as Bot).username,
      });

    const updateBotAssociation = new RocketChatAssociationRecord(
      RocketChatAssociationModel.MISC,
      (updatebotData as Bot).coreDdId
    );

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
