import {
  ButtonElement,
  MultiStaticSelectElement,
  StaticSelectElement,
} from "@rocket.chat/ui-kit";

export type ActionItemInput = {
  elements:
    | ButtonElement[]
    | StaticSelectElement[]
    | MultiStaticSelectElement[];
};
