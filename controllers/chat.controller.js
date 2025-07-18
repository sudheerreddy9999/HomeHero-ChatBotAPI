"use strict"
import logger from "../utility/logger.utility.js";
import ChatService from "../services/chat.service.js";

const QueryServicesController = async (request, response) => {
  try {
    console.log("Received chat request:", request.body);
    const { question } = request.body;
    if (!question) {
      return response.status(400).json({ message: "Query is required" });
    }
    
    const result = await ChatService.QueryServices(question);
    if (!result) {
      return response.status(404).json({ message: "No results found" });
    }
    
    return response.status(200).json({ data: result });
  } catch (error) {
    logger.error({ QueryServicesController: error.message });
    return response.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
const ChatController = { QueryServicesController };
export default ChatController;