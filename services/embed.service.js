import dotenv from "dotenv";
import fs from "fs";
import { Pinecone } from "@pinecone-database/pinecone";
import logger from "../utility/logger.utility.js";
import { OpenAI } from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.index(process.env.PINECONE_INDEX_NAME || "homehero");
let data = [];
try {
  const rawData = fs.readFileSync("data/homehero-content.json", "utf8");
  data = rawData ? JSON.parse(rawData) : [];
} catch (err) {
  logger.error({ EmbbedServiceGettingJsonFile: err.message });
  data = [];
}

const embedAndStore = async () => {
  try {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      const embeddingRes = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: item.content,
      });

      let fullEmbedding = embeddingRes.data[0].embedding;
      const embedding = fullEmbedding.slice(0, 1024);

      await index.upsert([
        {
          id: `item-${i}`,
          values: embedding,
          metadata: {
            ...item,
          },
        },
      ]);
    }
    return true;
  } catch (error) {
    logger.error({ embedAndStore: error.message });
  }
};

const embedService = { embedAndStore };

export default embedService;
