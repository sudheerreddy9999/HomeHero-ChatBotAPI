"use strict";

import dotenv from "dotenv";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAI } from "openai";
import logger from "../utility/logger.utility.js";

dotenv.config();
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.index(process.env.PINECONE_INDEX_NAME || "homehero");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const QueryServices = async (query) => {
  try {
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
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
      return "I couldn't find relevant information for your question.";
    }

    // Step 3: Build context from top results
    const context = matches
      .map((match, i) => `${i + 1}. ${match.metadata?.content || match.metadata?.title || "Unknown"}`)
      .join("\n");

    // Step 4: Ask GPT to answer based on context
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for a home services platform. Use the context provided to answer user questions.",
        },
        {
          role: "user",
          content: `Answer the following question using the context below:\n\nContext:\n${context}\n\nQuestion: ${query}`,
        },
      ],
    });

    const answer = completion.choices[0].message.content;
    return answer;
  } catch (error) {
    logger.error({ queryServices: error.message });
    throw new Error(" Failed to generate answer");
  }
};

const ChatService = { QueryServices };
export default ChatService;
