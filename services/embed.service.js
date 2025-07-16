import dotenv from "dotenv";
import fs from "fs";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAI } from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.index(process.env.PINECONE_INDEX_NAME || "homehero");
const data = JSON.parse(fs.readFileSync("data/homehero-content.json", "utf8"));
const  embedAndStore=async()=> {
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

      console.log(` Stored: ${item.content}`);
    }
    return "All items embedded and stored successfully!";
  } catch (error) {
    console.error("❌ Error embedding and storing:", error);
  }
}

const embedService = {embedAndStore};

export default embedService;
