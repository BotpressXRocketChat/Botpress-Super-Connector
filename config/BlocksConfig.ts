import { PRIMARY, DANGER, ActionIdsPrefixes } from "../types/Types";

export const LIST_BOT_CONFIG = {
  PRIMARY_TEXT: {
    TEXT: "Choose a bot from below to edit",
    BLOCK_ID: "list-bot-base-command-text",
  },
  CREATE_BUTTON: {
    STYLE: DANGER,
    LABEL: "Or create a new one in few easy steps",
    TEXT: "Create Bot",
    BLOCK_ID: "block#list-bot-create-button-element",
    ACTION_ID: `${ActionIdsPrefixes.CREATE_BOT}#core_command-action`,
  },
  BOT_BUTTON: {
    STYLE: PRIMARY,
  },
};

export const CREATE_UPDATE_BOT_MODAL_CONFIG = {
  CREATE_VIEW_ID: "create-bot-modal-view",
  UPDATE_VIEW_ID: "update-bot-modal-view",
  LABEL: "Bot Settings",
  FIELDS: [
    {
      TEXT_LABEL: "Botpress username",
      PLACE_HOLDER: "Username",
      BLOCK_ID: "block#botpress_username",
      ACTION_ID: "action#botpress_username",
    },
    {
      TEXT_LABEL: "Botpress Bot ID",
      PLACE_HOLDER: "Bot ID",
      BLOCK_ID: "block#botpress_id",
      ACTION_ID: "action#botpress_id",
    },
    {
      TEXT_LABEL: "Botpress Server URL",
      PLACE_HOLDER: "URL",
      BLOCK_ID: "block#botpress_server_url",
      ACTION_ID: "action#botpress__server_url",
    },
    {
      TEXT_LABEL: "Service Unavailable Message",
      PLACE_HOLDER: "Message",
      BLOCK_ID: "block#botpress_message",
      ACTION_ID: "action#botpress_message",
    },
  ],
  CLOSE_BUTTON: {
    STYLE: DANGER,
    TEXT: "Close",
    BLOCK_ID: "create-update-bot-close-modal",
    ACTION_ID: "action#close_modal-action",
  },
  SAVE_BUTTON: {
    STYLE: PRIMARY,
    TEXT: "Save",
    BLOCK_ID: "create-update-bot-save-statet",
    ACTION_ID: `${ActionIdsPrefixes.SAVE_BOT}#save_bot-action`,
  },
};
