import express from "express";

import { addSchool, listSchools } from "../../controllers/index.js";
import { handleValidationErrors, validateAddSchool, validateListSchools } from "../../middlewares/index.js";

const router = express.Router();

// /api/v1/schools POST
router.post("/", validateAddSchool, handleValidationErrors, addSchool);

// /api/v1/schools GET
router.get("/", validateListSchools, handleValidationErrors, listSchools);

export default router;