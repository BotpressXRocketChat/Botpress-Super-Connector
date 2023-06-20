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

export const createBotInsideDB = async (
  persistence: IPersistence,
  modify: IModify,
  logger: ILogger,
  updatebotData: Partial<IBotUser>
) => {
  try {
    return;
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};
