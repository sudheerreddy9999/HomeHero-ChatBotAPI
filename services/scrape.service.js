"use strict";
import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import mysql from "../config/database/database.config.js";
import logger from "../utility/logger.utility.js";
import queries from "../config/app/query.config.js";
import { QueryTypes } from "sequelize";
import ScrapingDto from "../dto/scrape.dto.js";

const scrapeService = async (request) => {
  try {
    const url = request.body.url;

    // if (
    //   !fs.existsSync(
    //     "/opt/render/.cache/puppeteer/chrome/linux-138.0.7204.94/chrome-linux64/chrome"
    //   )
    // ) {
    //   console.error("Chrome binary not found!");
    // }
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: "/usr/bin/chromium", // fallback: "/usr/bin/chromium-browser"
    });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle0" });

    const fullText = await page.evaluate(() => document.body.innerText);

    const lines = fullText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const topServices = [];
    const servicesMap = {};
    const fallbackData = [];

    for (let i = 0; i < lines.length; i++) {
      const name = lines[i];
      const subtitle = lines[i + 1] || "";

      if (/services?/i.test(name) && /^[A-Za-z\s.,]{10,80}$/.test(subtitle)) {
        const key = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_+|_+$/g, "");

        topServices.push({ key, name, subtitle });
        i++;
      }
    }

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

        const key = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_+|_+$/g, "");

        servicesMap[key] = {
          name,
          rating,
          price:
            priceList.length === 2
              ? { original: priceList[0], discounted: priceList[1] }
              : { price: priceList[0] },
        };

        i += 2;
        continue;
      }

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
    };

    // 🗂 Save to file
    const filename = `homehero-content-${Date.now()}.json`;
    const filePath = path.join("data", filename);
    fs.writeFileSync(filePath, JSON.stringify(finalData, null, 2));

    const data = await ScrapingDto.StoreScrapedFile(finalData);
    if (!data) {
      throw new Error("Failed to store scraped file");
    } else {
      console.log("Scraped file stored successfully:", data);
    }
  } catch (error) {
    logger.error(" scrapeService error:", error);
    throw error;
  }
};

const scrapingService = { scrapeService };
export default scrapingService;
