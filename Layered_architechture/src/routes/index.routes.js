import express from "express";
import toolboxRoutes from "./toolbox.routes.js";

const router= express.Router();
 
router.use("/toolbox", toolboxRoutes);

export default router;