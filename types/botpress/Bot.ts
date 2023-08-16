export type Bot = {
  username: string;
  botpressId: string;
  botpressServerUrl: string;
  unavailableMessage: string;
  coreDdId: string;
  scope: string[];
};

export type CoreDBIdsPersistenceStorage = {
  coreDBIDs: string[];
};
