import { PlainText } from "@rocket.chat/ui-kit";

export type PlainTextInput = {
  appId: string;
  blockId: string;
  actionId: string;
  placeholder?: PlainText;
  initialValue?: string;
  multiline?: boolean;
  minLength?: number;
  maxLength?: number;
};
