import {
  ButtonElement,
  SectionBlock,
  PlainText,
  LayoutBlockType,
  Markdown,
  ActionsBlock,
  PlainTextInputElement,
  InputBlock,
  MultiStaticSelectElement,
  Option,
} from "@rocket.chat/ui-kit";

import {
  TextBlockInput,
  SectionBlockInput,
  ButtonBlockInput,
  ActionItemInput,
  PlainTextInput,
  InputBlockInput,
  PLAIN_TEXT,
} from "../types/Types";

export function getTextObject(input: TextBlockInput): PlainText | Markdown {
  return {
    ...input,
  };
}

export function getSectionBlock(input: SectionBlockInput): SectionBlock {
  return {
    ...input,
    type: LayoutBlockType.SECTION,
  } as SectionBlock;
}

export function getButtonBlock(input: ButtonBlockInput): ButtonElement {
  return {
    ...input,
    type: "button",
  };
}

export function getActionBlock(input: ActionItemInput): ActionsBlock {
  return {
    ...input,
    type: "actions",
  };
}

export function getPlainTextInputBlock(
  input: PlainTextInput
): PlainTextInputElement {
  return {
    ...input,
    type: "plain_text_input",
  };
}

export function getInputBlock(input: InputBlockInput): InputBlock {
  return {
    ...input,
    type: "input",
  };
}

export function getOption(option: { TEXT: string; VALUE: string }): Option {
  return {
    text: getTextObject({
      type: PLAIN_TEXT,
      text: option["TEXT"],
    }) as PlainText,
    value: option["VALUE"],
  };
}
