import ToolService from '../services/toolService.js';

class ToolController {
    constructor() {
        this.toolService = new ToolService();
    }

    getAllTools = async (req, res) => {
        try {
            const {category, search, limit, skip, sort} = req.query;
            const filter = {};
            if(category) {
                filter.category = category;
            }
            const options = {}
            if(limit) {
                options.limit = parseInt(limit) || 10;
            }
            if(skip) {
                options.skip = parseInt(skip) || 0;
            }
            if(sort) {
                options.sort = sort;
            }
            let tools;
            if(search) {
                tools = await this.toolService.search(search, options);
            }else {
                tools = await this.toolService.getAllTools(filter, options);
            }
            res.status(200).json({ success: true, data: tools });
        }catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }  
    }

    createTool = async (req, res) => {
        try {
            const toolData = req.body;
            const tool = await this.toolService.createTool(toolData);
            res.status(201).json({ success: true, data: tool });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    createBulkTools = async (req, res) => {
        try {
            const toolsData = req.body;
            const results = await this.toolService.createBulkTools(toolsData);
            res.status(201).json({ success: true, data: results });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

export default ToolController;