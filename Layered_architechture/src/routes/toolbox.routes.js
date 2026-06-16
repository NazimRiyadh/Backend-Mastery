import express from "express";
const router= express.Router();

router.get("/", (req, res)=>{
    res.json({message:"Toolbox route"});
});

export default router;