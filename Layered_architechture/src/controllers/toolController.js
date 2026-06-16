import toolService from '../services/toolService.js';

class ToolController {
    constructor() {
        this.toolService = new toolService();
    }

    getAllTools = async (req, res) => {
        try {
            const {category, search, limit, skip, sort} = req.query;
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
        if(search) {
            tools = await this.toolService.searchTools(search, options);
        }else {
            tools = await this.toolService.getAllTools(filter, options);
        }
            res.status(200).json({ success: true, data: tools });
    }catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }  
    } 
}

export default ToolController;