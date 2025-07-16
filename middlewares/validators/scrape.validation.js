"use strict";

import { body,validationResult } from "express-validator";

const scrapeValidation = [
    // body("url")
    //     .trim()
    //     .notEmpty()
    //     .withMessage("Please Enter Valid URL")
    //     .isURL()
    //     .withMessage("Please Enter a Valid URL"),
    // body("type")
    //     .trim()
    //     .notEmpty()
    //     .withMessage("Please Enter Type of Scraping")
    //     .isIn(["text", "image", "video"])
    //     .withMessage("Type must be one of: text, image, video"),
    (request, response, next) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
        return response
            .status(400)
            .json({ message: "Bad Request", error: errors });
        }
        next();
    },
]

const ScrapingValidation = { scrapeValidation };
export default ScrapingValidation;