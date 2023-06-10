import { ButtonElement } from "@rocket.chat/ui-kit";
import { TextBlockInput } from "./TextBlock";

export type SectionBlockInput = {
  appId?: string;
  blockId?: string;
  text?: TextBlockInput;
  fields?: readonly TextBlockInput[];
  accessory?: ButtonElement;
};
