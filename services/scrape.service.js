"use strict";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import logger from "../utility/logger.utility.js";
import ScrapingDto from "../dto/scrape.dto.js";

const generateEmbeddingText = (service) => {
  const { name, rating, price } = service;
  const priceText = price?.discounted
    ? `The price is ${price.discounted} (original ${price.original}).`
    : `The price is ${price?.price || "not available"}.`;
  return `${name} has a rating of ${rating}. ${priceText}`;
};

const scrapeService = async (request) => {
  try {
    const url = request.body.url;
    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 20000 });

    const fullText = await page.evaluate(() => document.body.innerText);

    const lines = fullText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const topServices = [];
    const servicesMap = {};
    const fallbackData = [];
    const embeddingChunks = [];

    const generateKey = (str) =>
      str.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

    // Top Services Block
    for (let i = 0; i < lines.length; i++) {
      const name = lines[i];
      const subtitle = lines[i + 1] || "";

      if (/services?/i.test(name) && /^[A-Za-z\s.,]{10,80}$/.test(subtitle)) {
        const key = generateKey(name);
        topServices.push({ key, name, subtitle });
        i++;
      }
    }

    // Services with rating and price
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = lines[i + 1] || "";
      const nextNextLine = lines[i + 2] || "";

      const isRating = /^\d\.\d\s*\/\s*5$/.test(nextLine);
      const isPrice = /₹\s?\d{2,5}₹?\d{0,5}/.test(nextNextLine);

      if (isRating && isPrice) {
        const name = line;
        const rating = nextLine;
        const rawPrice = nextNextLine;

        const priceList = rawPrice
          .replace(/₹/g, " ₹")
          .trim()
          .replace(/\s+/g, " ")
          .split("₹")
          .filter((x) => x)
          .map((x) => `₹${x.trim()}`);

        const key = generateKey(name);

        const serviceData = {
          name,
          rating,
          price:
            priceList.length === 2
              ? { original: priceList[0], discounted: priceList[1] }
              : { price: priceList[0] },
        };

        servicesMap[key] = serviceData;

        // Embedding text
        const embeddingText = generateEmbeddingText(serviceData);
        embeddingChunks.push({
          id: key,
          content: embeddingText,
        });

        i += 2;
        continue;
      }

      // Contact Info (Phone or Email)
      if (/(\+91[-\s]?)?[6-9][0-9]{9}/.test(line)) {
        fallbackData.push({ type: "phone", content: line });
        continue;
      }

      if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(line)) {
        fallbackData.push({ type: "email", content: line });
        continue;
      }
    }

    const finalData = {
      top_services: topServices,
      services: servicesMap,
      meta: fallbackData,
      embeddingChunks: embeddingChunks,
    };

    // ✅ Ensure data directory exists
    const dirPath = path.resolve("data");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    // ✅ Save scraped data
    const filename = "homehero-content.json";
    const filePath = path.join(dirPath, filename);
    fs.writeFileSync(filePath, JSON.stringify(finalData, null, 2));

    // ✅ Save embedding text chunks
    const embeddingFilePath = path.join(dirPath, "embedding-chunks.json");
    fs.writeFileSync(embeddingFilePath, JSON.stringify(embeddingChunks, null, 2));

    // ✅ Store in DB if needed
    const data = await ScrapingDto.StoreScrapedFile(finalData);
    if (!data) {
      throw new Error("Failed to store scraped file");
    }

    console.log("Chunks for embedding:", embeddingChunks);

    return {
      scraped: finalData,
      embeddingTextChunks: embeddingChunks,
    };
  } catch (error) {
    logger.error("scrapeService error:", error);
    throw error;
  }
};

const scrapingService = { scrapeService };
export default scrapingService;
