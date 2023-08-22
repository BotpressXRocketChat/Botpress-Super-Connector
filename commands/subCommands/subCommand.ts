import {
  IHttp,
  IModify,
  IPersistence,
  IRead,
  ILogger,
} from "@rocket.chat/apps-engine/definition/accessors";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";

import { listBotCommandExecutor } from "./ListBots";
import { deleteBotCommandExecutor } from "./DeleteBot";

import { Subcommands } from "../../types/Types";
import { helpCommandExecutor } from "./Help";
import { Block } from "@rocket.chat/ui-kit";
import { sendNotification } from "../../helpers/Utility";

export class SubCommand {
  private appId: string;
  private logger: ILogger;
  constructor(logger: ILogger, appId: string) {
    this.logger = logger;
    this.appId = appId;
  }

  public async executor(
    context: SlashCommandContext,
    read: IRead,
    modify: IModify,
    http: IHttp,
    persist: IPersistence,
    subCommand: string
  ): Promise<void> {
    const [command] = context.getArguments();

    let messageBlocks: Block[];

    switch (command) {
      case Subcommands.ListBots:
        messageBlocks = await listBotCommandExecutor(
          context,
          read,
          modify,
          this.logger,
          this.appId
        );
        break;
        ``;
      case Subcommands.DeleteBot:
        messageBlocks = deleteBotCommandExecutor(
          context,
          read,
          modify,
          this.logger,
          this.appId
        );
        break;

      default:
        messageBlocks = [
          ...(await listBotCommandExecutor(
            context,
            read,
            modify,
            this.logger,
            this.appId
          )),
          ...helpCommandExecutor(
            context,
            read,
            modify,
            this.logger,
            this.appId
          ),
        ];
    }

    await sendNotification(context, modify, read, messageBlocks);

    return;
  }
}
