import {
  ILogger,
  IModify,
  IPersistence,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IBotUser } from "@rocket.chat/apps-engine/definition/users/IBotUser";
import { UserType } from "@rocket.chat/apps-engine/definition/users";
import {
  RocketChatAssociationModel,
  RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";
import { getAllBots } from "../db/ReadBot";

export const createBotInsideDB = async (
  persistence: IPersistence,
  modify: IModify,
  logger: ILogger,
  newBotData: Partial<IBotUser>,
  appID: string
) => {
  try {
    const newBot: Partial<IBotUser> = {
      username: newBotData["botpress_username"],
      type: UserType.BOT,
      isEnabled: true,
      name: newBotData["botpress_username"],
      roles: ["bot"],
    };

    const botBuilderData = modify.getCreator().startBotUser(newBot);

    let coreDdId = await modify.getCreator().finish(botBuilderData);

    const newBotAssociation = new RocketChatAssociationRecord(
      RocketChatAssociationModel.MISC,
      appID
    );

    await persistence.createWithAssociation(
      { ...newBot, coreDdId },
      newBotAssociation
    );
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};
