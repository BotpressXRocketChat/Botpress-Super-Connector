import {
  ILogger,
  IModify,
  IPersistence,
  IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IBotUser } from "@rocket.chat/apps-engine/definition/users/IBotUser";
import { UserType } from "@rocket.chat/apps-engine/definition/users";
import {
  RocketChatAssociationModel,
  RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";
import { Bot, CoreDBIdsPersistenceStorage } from "../types/Types";
import { validateCoreDBIdsStorage } from "../validator/DBResponse";

export const createBotInsideDB = async (
  persistence: IPersistence,
  modify: IModify,
  read: IRead,
  logger: ILogger,
  newBotData: Partial<Bot>,
  appID: string
) => {
  try {
    const newBot: Partial<IBotUser> = {
      username: newBotData["username"],
      type: UserType.BOT,
      isEnabled: true,
      name: newBotData["username"],
      roles: [UserType.BOT],
    };

    const botBuilderData = modify.getCreator().startBotUser(newBot);

    let coreDdId = await modify.getCreator().finish(botBuilderData);

    const newBotAssociation = new RocketChatAssociationRecord(
      RocketChatAssociationModel.MISC,
      coreDdId
    );

    await persistence.createWithAssociation(
      { ...newBotData, coreDdId },
      newBotAssociation
    );

    const botsCoreDBIdsAssociation = new RocketChatAssociationRecord(
      RocketChatAssociationModel.MISC,
      appID
    );

    let botsCoreDBIdsPersistence: CoreDBIdsPersistenceStorage =
      validateCoreDBIdsStorage(
        (await read
          .getPersistenceReader()
          .readByAssociation(
            botsCoreDBIdsAssociation
          )) as CoreDBIdsPersistenceStorage[]
      );

    botsCoreDBIdsPersistence.coreDBIDs.push(coreDdId);

    const updateBotsCoreDBIdsAssociation = new RocketChatAssociationRecord(
      RocketChatAssociationModel.MISC,
      appID
    );

    await persistence.updateByAssociation(
      updateBotsCoreDBIdsAssociation,
      botsCoreDBIdsPersistence,
      true
    );
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};
