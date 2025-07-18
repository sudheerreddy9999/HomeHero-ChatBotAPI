import dotenv from "dotenv";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAI } from "openai";
import logger from "../utility/logger.utility.js";
import AuthValidation from "../middlewares/validators/auth.validation.js";
import ChatDto from "../dto/chat.dto.js";
import AuthDTO from "../dto/auth.dto.js";

dotenv.config();

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.index(process.env.PINECONE_INDEX_NAME || "homehero");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const QueryServices = async (request, response) => {
  const token = request.headers.authorization?.split(" ")[1];
  let user_id;

  const userDetails = await AuthValidation.GetUserDeatilsFromToken(token);
  if (userDetails === "Invalid Token") {
    logger.error("Invalid token received");
    return response.status(401).json({ message: "Unauthorized" });
  } else {
    // user_id = userDetails?.id;
    const userData = await AuthDTO.GetUserDTO(
      userDetails.email,
      userDetails?.mobile_number
    );
    user_id = userData[0].user_id;
  }

  if (!user_id) {
    logger.error("User ID missing from token");
    return response.status(400).json({ message: "User not found" });
  }

  const { question } = request.body;
  if (!question) {
    return response.status(400).json({ message: "Query is required" });
  }

  try {
    // ✅ Store user's message
    await ChatDto.InsertChatMessageDTO({
      user_id,
      role: "user",
      message: question,
    });

    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
    });

    let embedding = embeddingRes.data[0].embedding;
    embedding = embedding.slice(0, 1024);

    const result = await index.query({
      topK: 3,
      vector: embedding,
      includeMetadata: true,
    });

    const matches = result.matches || [];
    if (matches.length === 0) {
      return response.status(200).json({
        message: "I couldn't find relevant information for your question.",
      });
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
            "You are a helpful assistant for a home services platform. Use the context provided to answer user questions.",
        },
        {
          role: "user",
          content: `Answer the following question using the context below:\n\nContext:\n${context}\n\nQuestion: ${question}`,
        },
      ],
    });

    const answer = completion.choices[0].message.content;
    await ChatDto.InsertChatMessageDTO({
      user_id,
      role: "bot",
      message: answer,
    });

    return { answer };
  } catch (error) {
    logger.error({ queryServices: error.message });
    return response.status(500).json({ message: "Failed to generate answer" });
  }
};

const ChatService = { QueryServices };
export default ChatService;
