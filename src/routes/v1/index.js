import express from "express";

import InfoController from "../../controllers/index.js";
import schoolRoutes from "./school-routes.js";

const router = express.Router();

router.get("/info", InfoController.info);
router.use("/addSchool", schoolRoutes);
router.use("/listSchools", schoolRoutes);

export default router;
