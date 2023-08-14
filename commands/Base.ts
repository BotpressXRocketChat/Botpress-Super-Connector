import {
  IHttp,
  IModify,
  IPersistence,
  IRead,
  ILogger,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
  ISlashCommand,
  SlashCommandContext,
} from "@rocket.chat/apps-engine/definition/slashcommands";
import { SubCommand } from "./subCommands/subCommand";

export class Base implements ISlashCommand {
  public command = "botpress";
  public i18nDescription = "";
  public providesPreview = false;
  public i18nParamsExample = "";
  public _logger: ILogger;
  public _appId: string;
  public subCommand: SubCommand;

  constructor(logger: ILogger, appId: string) {
    this._logger = logger;
    this._appId = appId;
    this.subCommand = new SubCommand(logger, appId);
  }

  public async executor(
    context: SlashCommandContext,
    read: IRead,
    modify: IModify,
    http: IHttp,
    persist: IPersistence
  ): Promise<void> {
    const [command] = context.getArguments();

    this.subCommand.executor(context, read, modify, http, persist, command);

    return;
  }
}
