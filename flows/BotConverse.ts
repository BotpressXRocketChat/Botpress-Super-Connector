import { Bot, ConverseResponse } from "../types/Types";
import {
  getConverseAPIRequestContent,
  generateServiceUnavailableMessage,
} from "../helpers/Botpress";

import {
  IHttp,
  ILogger,
  IModify,
  IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { getAllBots } from "../db/Read";
import { conversate } from "../helpers/Utility";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";

export const intitateConversationHandler = async (
  read: IRead,
  http: IHttp,
  modify: IModify,
  appId: string,
  logger: ILogger,
  botUsername: string,
  threadID: string,
  text: string,
  room: IRoom
): Promise<void> => {
  const persistenceData: Bot[] = await getAllBots(appId, read);

  let requiredBot: Bot | null = null;

  persistenceData.map((bot) => {
    if (bot.username == botUsername) {
      requiredBot = bot;
    }
  });

  if (!requiredBot) return;

  const apiResponse: ConverseResponse = await initiateConversationWithBot(
    http,
    requiredBot,
    threadID,
    text
  );

  const botUserCoreDB: IUser = await read
    .getUserReader()
    .getById((requiredBot as Bot).coreDdId);

  for (let idx = 0; idx < apiResponse.responses.length; idx++) {
    await conversate(
      modify,
      apiResponse.responses[idx],
      botUserCoreDB,
      requiredBot,
      room,
      threadID,
      appId,
      logger
    );
  }
};

export const initiateConversationWithBot = async (
  http: IHttp,
  botData: Bot,
  session: string,
  text: string
): Promise<ConverseResponse> => {
  const requestContent = getConverseAPIRequestContent(text);

  const botpressWebhookUrl = `${botData.botpressServerUrl}/api/v1/bots/${botData.botpressId}/converse/${session}`;

  try {
    const { data } = await http.post(botpressWebhookUrl, requestContent);

    return data;
  } catch (error) {
    return generateServiceUnavailableMessage(botData);
  }
};
