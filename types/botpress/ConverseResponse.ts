export type Choice = {
  title: string;
  value: string;
};

export enum ResponseType {
  TEXT = "text",
  SINGLE_CHOICE = "single-choice",
  MULTI_CHOICE = "multi-choice",
}

export type Response = {
  type: ResponseType;
  skill?: string;
  workflow: object;
  text: string;
  choices?: Choice[];
  typing: Boolean;
};

export type ConverseResponse = {
  responses: Response[];
};
