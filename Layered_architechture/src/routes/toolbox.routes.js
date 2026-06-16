import express from "express";
import ToolController from "../controllers/toolController.js";
const router= express.Router();

const toolController = new ToolController();

router.get("/", toolController.getAllTools);

router.post("/", toolController.createTool);

router.post("/bulk", toolController.createBulkTools);

export default router;