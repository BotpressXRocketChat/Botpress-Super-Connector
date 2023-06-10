export const MARK_DOWN = "mrkdwn";
export const PLAIN_TEXT = "plain_text";

export type TextBlockInput = {
  type: "plain_text" | "mrkdwn";
  text: string;
  emoji?: boolean;
};
