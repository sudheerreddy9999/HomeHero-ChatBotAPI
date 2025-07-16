"use strict";
import scrapeService from "../services/scrape.service.js";
import logger from "../utility/logger.utility.js";

const ScrapeController = async (request, response) => {
    try {
        const data = await scrapeService.scrapeService(request);
        return response.status(200).json({ message: "Scraping completed successfully", data });
    }catch (error) {
        logger.error({ ScrapeController: error.message });
        return response.status(500).json({ message: "Internal server error" });
    }
}

const ScrapingController = { ScrapeController };
export default ScrapingController;