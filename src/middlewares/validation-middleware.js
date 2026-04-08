import { body, query, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

const validateAddSchool = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("address").trim().notEmpty().withMessage("Address is required"),
    body("latitude")
        .notEmpty().withMessage("Latitude is required")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be a valid number between -90 and 90")
        .toFloat(),
    body("longitude")
        .notEmpty().withMessage("Longitude is required")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be a valid number between -180 and 180")
        .toFloat()
];

const validateListSchools = [
    query("latitude")
        .notEmpty().withMessage("Latitude query parameter is required")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be a valid number between -90 and 90")
        .toFloat(),
    query("longitude")
        .notEmpty().withMessage("Longitude query parameter is required")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be a valid number between -180 and 180")
        .toFloat()
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Validation failed",
            errors: errors.array().map((error) => ({
                field: error.path,
                message: error.msg
            }))
        });
    }

    return next();
};

export { handleValidationErrors, validateAddSchool, validateListSchools };