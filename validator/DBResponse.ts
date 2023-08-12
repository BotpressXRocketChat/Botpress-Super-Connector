import { ILogger } from "@rocket.chat/apps-engine/definition/accessors";
import { Bot, CoreDBIdsPersistenceStorage } from "../types/Types";

export const validateBot = (bot: Bot): boolean => {
  if (
    !bot.username ||
    !bot.botpressId ||
    !bot.botpressServerUrl ||
    !bot.unavailableMessage ||
    !bot.coreDdId
  ) {
    return false; // Missing required properties
  }
  return true;
};

// Function to validate an array of Bot objects
export const validateBots = (data: Array<Bot[]>): Bot[] => {
  return data.reduce((acc, bot) => {
    if (bot.length && validateBot(bot[0])) {
      acc.push(bot[0]); // Add to the validBots array if validation passes
    }
    return acc;
  }, []);
};

// Function to validate CoreDBIdsPersistenceStorage
export const validateCoreDBIdsStorage = (
  coreDBIdsStorage: Array<CoreDBIdsPersistenceStorage>,
  logger?: ILogger
): CoreDBIdsPersistenceStorage => {
  try {
    logger?.info(coreDBIdsStorage);
    if (
      !coreDBIdsStorage.length ||
      !coreDBIdsStorage[0]?.coreDBIDs ||
      !coreDBIdsStorage[0]?.coreDBIDs?.length
    ) {
      return { coreDBIDs: [] };
    }

    return coreDBIdsStorage[0];
  } catch (error) {
    if (logger) logger.info("Issue while validating CoreDBIDS Storage");
    return { coreDBIDs: [] };
  }
};
