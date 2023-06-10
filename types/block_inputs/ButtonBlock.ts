import { PlainText, Markdown } from "@rocket.chat/ui-kit";

export const PRIMARY = "primary";
export const DANGER = "danger";

export type ButtonBlockInput = {
  appId: string;
  blockId: string;
  actionId: string;
  text: PlainText;
  url?: string;
  value?: string;
  style?: "primary" | "danger";
};
