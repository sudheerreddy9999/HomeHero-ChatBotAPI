"use strict"
import logger from "../utility/logger.utility.js";
import embedService from "../services/embed.service.js";

const EmbedAndServiceController = async (request, response) => {
  try {
    await embedService.embedAndStore();
    return response.status(200).json({ message: "Embedding and service completed successfully" });
  } catch (error) {
    logger.error({ EmbedAndServiceController: error.message });
    return response.status(500).json({ message: "Internal Server Error", error: error.message,sudher:"sudheer " });
  }
}

const EmbedController = { EmbedAndServiceController };
export default EmbedController;
