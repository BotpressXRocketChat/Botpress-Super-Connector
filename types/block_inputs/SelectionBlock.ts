import { Option } from "@rocket.chat/ui-kit";
import { TextBlockInput } from "./TextBlock";

export type MultiSelectionBlockInput = {
  appId: string;
  blockId: string;
  actionId: string;
  options: Option[];
  placeholder: TextBlockInput;
  initialOption?: Option;
  initialValue?: Option["value"];
};