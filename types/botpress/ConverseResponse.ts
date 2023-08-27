export type Choice = {
  title: string;
  value: string;
};

export enum ResponseType {
  TEXT = "text",
  SINGLE_CHOICE = "single-choice",
  MULTI_CHOICE = "multi-choice",
  AUDIO = "audio",
  CARD = "card",
  IMAGE = "image",
  DROPDOWN = "dropdown",
  VIDEO = "video",
  LOCATION = "location",
  FILE = "file",
  CAROUSEL = "carousel",
}

export type Action = {
  action: string;
  title: string;
  text: string;
};

export type Item = {
  title: string;
  subtitle: string;
  image: string;
  actions: Action[];
};

export type Response =
  | TextResponse
  | AudioResponse
  | SingleChoiceResponse
  | ImageResponse
  | CarouselResponse
  | CardResponse
  | VideoResponse;

export type TextResponse = {
  type: ResponseType.TEXT;
  workflow: object;
  text: string;
  typing: Boolean;
};

export type AudioResponse = {
  type: ResponseType.AUDIO;
  workflow: object;
  audio: string;
  title: string;
  typing: Boolean;
};

export type SingleChoiceResponse = {
  type: ResponseType.SINGLE_CHOICE;
  workflow: object;
  choices: Choice[];
  text: string;
  typing: Boolean;
};

export type ImageResponse = {
  type: ResponseType.IMAGE;
  image: string;
  workflow: object;
  title: string;
  typing: Boolean;
};

export type CarouselResponse = {
  type: ResponseType.CAROUSEL;
  workflow: object;
  typing: Boolean;
  items: Item[];
};

export type CardResponse = {
  type: ResponseType.CARD;
  image: string;
  workflow: object;
  title: string;
  subtitle: string;
  actions: Action[];
};

export type VideoResponse = {
  type: ResponseType.VIDEO;
  video: string;
  title: string;
  typing: boolean;
  workflow: object;
};

export type ConverseResponse = {
  responses: Response[];
};
