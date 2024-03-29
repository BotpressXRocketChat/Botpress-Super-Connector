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
import { conversate, getChatSession } from "../helpers/Utility";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";

export const intitateConversationHandler = async (
  read: IRead,
  http: IHttp,
  modify: IModify,
  appId: string,
  logger: ILogger,
  botUsername: string,
  text: string,
  room: IRoom,
  threadId?: string
): Promise<void> => {
  const persistenceData: Bot[] = await getAllBots(appId, read);

  let requiredBot: Bot | null = null;

  persistenceData.map((bot) => {
    if (bot.username == botUsername) {
      requiredBot = bot;
    }
  });

  if (!requiredBot) return;

  if (!(requiredBot as Bot)?.scope.includes(room.type))
    throw new Error("Scope issue");

  const sessionId = getChatSession(room, threadId || "");

  const apiResponse: ConverseResponse = await initiateConversationWithBot(
    http,
    requiredBot,
    text,
    sessionId
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
      appId,
      logger,
      threadId
    );
  }
};

export const initiateConversationWithBot = async (
  http: IHttp,
  botData: Bot,
  text: string,
  sessionId?: string
): Promise<ConverseResponse> => {
  const requestContent = getConverseAPIRequestContent(text);

  const botpressWebhookUrl = `${botData.botpressServerUrl}/api/v1/bots/${botData.botpressId}/converse/${sessionId}`;

  try {
    const { data } = await http.post(botpressWebhookUrl, requestContent);

    return data;
  } catch (error) {
    return generateServiceUnavailableMessage(botData);
  }
};
