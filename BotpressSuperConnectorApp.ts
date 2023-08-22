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
import { Base } from "./commands/Base";
import { executeBlockActionHandler } from "./handlers/ExecuteBlockActionHandler";
import { executeViewSubmitHandler } from "./handlers/ExecuteViewSubmitHandler";
import {
  IUIKitResponse,
  UIKitBlockInteractionContext,
  UIKitViewSubmitInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";
import {
  IMessage,
  IPostMessageSent,
} from "@rocket.chat/apps-engine/definition/messages";
import { executePostMessageSentHandler } from "./handlers/ExecutePostMessageSentHandler";

export class BotpressSuperConnectorApp extends App implements IPostMessageSent {
  constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
    super(info, logger, accessors);
  }

  public async extendConfiguration(
    configuration: IConfigurationExtend
  ): Promise<void> {
    const listBotsCommand: Base = new Base(this.getLogger(), this.getID());
    await configuration.slashCommands.provideSlashCommand(listBotsCommand);
  }

  public async executeBlockActionHandler(
    context: UIKitBlockInteractionContext,
    read: IRead,
    http: IHttp,
    persistence: IPersistence,
    modify: IModify
  ): Promise<IUIKitResponse> {
    // return
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

  public async executeLivechatBlockActionHandler(
    context: UIKitBlockInteractionContext,
    read: IRead,
    http: IHttp,
    persistence: IPersistence,
    modify: IModify
  ): Promise<IUIKitResponse> {
    // return
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
    return await executeViewSubmitHandler(
      context,
      read,
      persistence,
      modify,
      this.getID(),
      this.getLogger()
    );
  }

  public async executePostMessageSent(
    message: IMessage,
    read: IRead,
    http: IHttp,
    persistence: IPersistence,
    modify: IModify
  ): Promise<void> {
    return await executePostMessageSentHandler(
      message,
      read,
      http,
      persistence,
      modify,
      this.getID(),
      this.getLogger()
    );
  }
}
