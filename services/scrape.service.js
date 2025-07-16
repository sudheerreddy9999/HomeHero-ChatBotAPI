import puppeteer from "puppeteer";
import fs from "fs";

const scrapeService = async (request) => {
  try {
    const url = request.body.url;
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle0" });

    const fullText = await page.evaluate(() => {
      return document.body.innerText;
    });

    const lines = fullText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const extractedData = [];

    for (let i = 0; i < lines.length; i++) {
      const current = lines[i];
      const next = lines[i + 1] || "";

      const priceMatch = next.match(/₹\s?\d{2,5}₹?\d{0,5}/); // ₹799₹599 or ₹799
      const isServiceName = /(repair|service|cleaning|mount|installation|geyser|purifier|tap|pipe|tv)/i.test(
        current
      );

      // Combine service name + price
      if (isServiceName && priceMatch) {
        const formattedPrice = priceMatch[0]
          .replace(/₹/g, " ₹")
          .trim()
          .replace(/\s+/g, " ");

        extractedData.push({
          type: "service_info",
          content: `Service: ${current}\nPrice: ${formattedPrice}`,
        });

        i++; 
        continue;
      }

      if (/(\+91[-\s]?)?[6-9][0-9]{9}/.test(current)) {
        extractedData.push({ type: "phone", content: current });
        continue;
      }
      if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(current)) {
        extractedData.push({ type: "email", content: current });
        continue;
      }
      extractedData.push({ type: "text", content: current });
    }

    await browser.close();
    fs.writeFileSync(
      "data/homehero-content.json",
      JSON.stringify(extractedData, null, 2)
    );

    console.log("Scraped and saved!", extractedData.length, "items");
  } catch (error) {
    console.error("scrapeService error:", error);
    throw error;
  }
};

const scrapingService = { scrapeService };
export default scrapingService;
