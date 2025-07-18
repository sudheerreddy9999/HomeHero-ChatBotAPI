import { body, validationResult } from "express-validator";

const scrapeValidation = [
    body("url")
        .trim()
        .notEmpty()
        .withMessage("Please Enter Valid URL")
        .isURL()
        .withMessage("Please Enter a Valid URL"),
    (req, res, next) => {
        console.log("Request body inside validator:", req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Validation failed", errors: errors.array() });
        }
        next();
    },
];

const ScrapingValidation = { scrapeValidation };
export default ScrapingValidation;