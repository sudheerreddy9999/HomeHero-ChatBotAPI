"use strict";
import logger from "../utility/logger.utility.js";
import ChatServices from "../services/chat.service.js";

const ChatServicesController = async (request, response) => {
  try {
    const result = await ChatServices.ChatService(request);
    console.log(result);
    if (!result) {
      return response.status(404).json({ message: "No results found" });
    }

    return response.status(200).json({ data: result });
  } catch (error) {
    logger.error({ QueryServicesController: error.message });
    return response
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
const GetChatMessagesBySessionController = async (request, response) => {
  try {
    const result = await ChatServices.GetChatMessagesBySessionService(request);
    if (request.errorCode) {
      return response
        .status(result.errorCode)
        .json({ message: result.customMessage });
    }
    return response.status(200).json({ data: result });
  } catch (error) {a  
    logger.error({ GetChatMessagesBySessionController: error.message });
    return response
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
const ChatController = { ChatServicesController,GetChatMessagesBySessionController };
export default ChatController;
