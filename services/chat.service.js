import dotenv from "dotenv";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAI } from "openai";
import logger from "../utility/logger.utility.js";
import AuthValidation from "../middlewares/validators/auth.validation.js";
import ChatDto from "../dto/chat.dto.js";
import AuthDTO from "../dto/auth.dto.js";
import customUtility from "../utility/custom.utility.js";

const { CustomMessage } = customUtility;

dotenv.config();

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.index(process.env.PINECONE_INDEX_NAME || "homehero");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ChatService = async (request) => {
  const token = request.headers.authorization?.split(" ")[1];
  let user_id;

  const userDetails = await AuthValidation.GetUserDeatilsFromToken(token);
  if (userDetails === "Invalid Token") {
    logger.error("Invalid token received");
    return CustomMessage(401, "Invalid Token");
  }

  const userData = await AuthDTO.GetUserDTO(
    userDetails.email,
    userDetails?.mobile_number
  );
  user_id = userData?.[0]?.user_id;

  if (!user_id) {
    logger.error("User ID missing from token");
    return CustomMessage(400, "User ID is required");
  }

  const { question, session_id } = request.body;
  if (!question || !session_id) {
    return CustomMessage(400, "Question and session_id are required");
  }

  try {
    // 📝 Store user's question
    await ChatDto.InsertChatMessageDTO(
      user_id,
       "user",
       question,
      session_id,
    );

    // 🧠 Get last 3 messages from session
    const previousMessages = await ChatDto.SessionMessages3DTO(session_id);
    const formattedHistory = previousMessages
      .map((msg) => `${msg.role === "user" ? "User" : "Bot"}: ${msg.message}`)
      .join("\n");

    // 🔍 Vector embedding
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
    });

    let embedding = embeddingRes.data[0].embedding.slice(0, 1024);

    const result = await index.query({
      topK: 3,
      vector: embedding,
      includeMetadata: true,
    });

    const matches = result.matches || [];
    if (matches.length === 0) {
      return CustomMessage(404, "No relevant context found");
    }

    const context = matches
      .map(
        (match, i) =>
          `${i + 1}. ${
            match.metadata?.content || match.metadata?.title || "Unknown"
          }`
      )
      .join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant for a home services platform. Use both the previous chat history and current context to answer the user.",
        },
        {
          role: "user",
          content: `Chat History:\n${formattedHistory}\n\nContext:\n${context}\n\nQuestion: ${question}`,
        },
      ],
    });

    const answer = completion.choices[0].message.content;

    // 📝 Store bot response
    await ChatDto.InsertChatMessageDTO(
      user_id,
       "bot",
       answer,
      session_id,
    );

    return { answer };
  } catch (error) {
    logger.error({ chatServices: error.message });
    return CustomMessage(500, "Failed to process your request");
  }
};

const GetChatMessagesBySessionService = async (request) => {
  try {
    const { session_id } = request.query;
    if (!session_id) {
      return CustomMessage(400, "Session ID is required");
    }
    const messages = await ChatDto.GetChatMessagesBySessionDTO(session_id);
    if (messages.length === 0) {
      return CustomMessage(404, "No messages found for this session");
    }
    return messages;
  } catch (error) {
    logger.error({ GetChatMessagesBySessionService: error.message });
    throw new Error("Failed to retrieve chat messages");
  }
};

const ChatServices = { ChatService, GetChatMessagesBySessionService };
export default ChatServices;
