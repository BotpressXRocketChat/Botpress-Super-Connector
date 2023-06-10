import {
  IAppAccessors,
  IConfigurationExtend,
  IHttp,
  ILogger,
  IModify,
  IPersistence,
  IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { App } from "@rocket.chat/apps-engine/definition/App";
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata";
import { ListBots } from "./commands/ListBots";
import { executeBlockActionHandler } from "./handlers/ExecuteBlockActionHandler";
import { executeViewSubmitHandler } from "./handlers/ExecuteViewSubmitHandler";

import {
  IUIKitResponse,
  UIKitBlockInteractionContext,
  UIKitViewSubmitInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";

export class BotpressSuperConnectorApp extends App {
  constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
    super(info, logger, accessors);
  }

  public async extendConfiguration(
    configuration: IConfigurationExtend
  ): Promise<void> {
    this.getLogger().warn(this.getID());
    const listBotsCommand: ListBots = new ListBots(
      this.getLogger(),
      this.getID()
    );
    await configuration.slashCommands.provideSlashCommand(listBotsCommand);
  }

  public async executeBlockActionHandler(
    context: UIKitBlockInteractionContext,
    read: IRead,
    http: IHttp,
    persistence: IPersistence,
    modify: IModify
  ): Promise<IUIKitResponse> {
    const data = context.getInteractionData();
    const { actionId, user } = data;

    return await executeBlockActionHandler(
      context,
      read,
      http,
      persistence,
      modify,
      this.getID(),
      this.getLogger()
    );
  }

  public async executeViewSubmitHandler(
    context: UIKitViewSubmitInteractionContext,
    read: IRead,
    http: IHttp,
    persistence: IPersistence,
    modify: IModify
  ) {
    return executeViewSubmitHandler(
      context,
      read,
      persistence,
      modify,
      this.getLogger()
    );
  }
}
