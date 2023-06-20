import {
  IPersistence,
  IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
  RocketChatAssociationModel,
  RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";

export const getBotByID = async () => {};

export const getAllBots = async (
  appId: string,
  read: IRead
): Promise<Array<object>> => {
  const data = await read
    .getPersistenceReader()
    .readByAssociation(
      new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, appId)
    );

  return data;
};
