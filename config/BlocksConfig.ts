import { RoomType } from "@rocket.chat/apps-engine/definition/rooms";
import {
  PRIMARY,
  DANGER,
  ActionIdsPrefixes,
  Subcommands,
  AppRoomType,
} from "../types/Types";

export const BLOCK = Object.freeze("block"),
  ACTION = Object.freeze("ACTION");

export const SEPARATOR = Object.freeze("»");

export const HELP_CONFIG = Object.freeze({
  PRIMARY_TEXT: {
    TEXT: "Botpress Super Connector",
    BLOCK_ID: "help-menu",
  },
  BODY: [
    {
      TEXT: `1: '${Subcommands.Help}' subcommand will show the help menu`,
      BLOCK_ID: "help-menu-help-subcommand",
    },
    {
      TEXT: `2: '${Subcommands.ListBots}' subcommand will list all your configured bots`,
      BLOCK_ID: "help-menu-list-bot-subcommand",
    },
    {
      TEXT: `3: '${Subcommands.DeleteBot}' + Bot's user's name subcommand will list all your configured bots, , for eg /botpress delete-bot username`,
      BLOCK_ID: "help-menu-delete-bot-subcommand",
    },
  ],
});

export const LIST_BOT_CONFIG = Object.freeze({
  PRIMARY_TEXT: {
    TEXT: "Choose a bot from below to edit",
    BLOCK_ID: "list-bot-base-command-text",
  },
  CREATE_BUTTON: {
    STYLE: DANGER,
    LABEL: "Or create a new one in few easy steps",
    TEXT: "Create Bot",
    BLOCK_ID: `${BLOCK}#list-bot-create-button-element`,
    ACTION_ID: `${ActionIdsPrefixes.CREATE_BOT}#core_command-${ACTION}`,
  },
  BOT_BUTTON: {
    STYLE: PRIMARY,
  },
});

export const DELETE_BOT_CONFIG = Object.freeze({
  PRIMARY_TEXT: {
    TEXT: "Are you sure you want to delete the bot",
    BLOCK_ID: "delete-bot-base-command-text",
  },
  INVALID_PROMPT: {
    TEXT: "Provide valid bot username in subcommand or run /botpress help for usage",
    BLOCK_ID: "delete-bot-invalid-text",
  },
  DELETE_BUTTON: {
    STYLE: DANGER,
    LABEL: "Delete",
    TEXT: "Delete",
    BLOCK_ID: `${BLOCK}#delete-bot`,
    ACTION_ID: `${ActionIdsPrefixes.DELETE_BOT}#delete-${ACTION}`,
  },
});

export const CREATE_UPDATE_BOT_MODAL_CONFIG = Object.freeze({
  CREATE_VIEW_ID: "create-bot-modal-view",
  UPDATE_VIEW_ID: "update-bot-modal-view",
  LABEL: "Bot Settings",
  FIELDS: [
    {
      TEXT_LABEL: "Botpress username",
      PLACE_HOLDER: "Username",
      BLOCK_ID: `${BLOCK}#username`,
      ACTION_ID: `${ACTION}#username`,
    },
    {
      TEXT_LABEL: "Botpress Bot ID",
      PLACE_HOLDER: "Bot ID",
      BLOCK_ID: `${BLOCK}#botpressId`,
      ACTION_ID: `${ACTION}#botpressId`,
    },
    {
      TEXT_LABEL: "Botpress Server URL",
      PLACE_HOLDER: "URL",
      BLOCK_ID: `${BLOCK}#botpressServerUrl`,
      ACTION_ID: `${ACTION}#botpressServerUrl`,
    },
    {
      TEXT_LABEL: "Service Unavailable Message",
      PLACE_HOLDER: "Message",
      BLOCK_ID: `${BLOCK}#unavailableMessage`,
      ACTION_ID: `${ACTION}#unavailableMessage`,
    },
    {
      TEXT_LABEL: "Bot's Scope",
      PLACE_HOLDER: "Scope the bot to specific chat spaces",
      OPTIONS: [
        {
          TEXT: AppRoomType.CHANNEL,
          VALUE: RoomType.CHANNEL,
        },
        {
          TEXT: AppRoomType.DIRECT_CHAT,
          VALUE: RoomType.DIRECT_MESSAGE,
        },
        {
          TEXT: AppRoomType.LIVE_CHAT,
          VALUE: RoomType.LIVE_CHAT,
        },
      ],
      BLOCK_ID: `${BLOCK}#scope`,
      ACTION_ID: `${ACTION}#scope`,
      TYPE: "static_select",
    },
  ],
  CLOSE_BUTTON: {
    STYLE: DANGER,
    TEXT: "Close",
    BLOCK_ID: "create-update-bot-close-modal",
    ACTION_ID: `${ACTION}#close_modal-${ACTION}`,
  },
  SAVE_BUTTON: {
    STYLE: PRIMARY,
    TEXT: "Save",
    BLOCK_ID: "create-update-bot-save-state",
    ACTION_ID: `${ActionIdsPrefixes.SAVE_BOT}#save_bot-${ACTION}`,
  },
  UPDATE_BUTTON: {
    STYLE: PRIMARY,
    TEXT: "Update",
    BLOCK_ID: "create-update-bot-save-state",
    ACTION_ID: `${ActionIdsPrefixes.UPDATE_BOT}#update_bot-${ACTION}`,
  },
});
