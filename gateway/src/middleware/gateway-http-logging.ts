import morgan from "morgan";
import { logger } from "../logger/logger";

export const httpLogger = morgan("combined", {
  stream: {
    write: (message: string) => {
      logger.info(message.trim());
    },
  },
});