import express from "express";
import ExportController from "../controllers/exportController.js";
import exportExcel from "../middlewares/exportMiddleware.js";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/products", verifyToken, verifyAdmin, ExportController.formatProducts, exportExcel);
router.get("/orders", verifyToken, verifyAdmin, ExportController.formatOrders, exportExcel);

export default router;
