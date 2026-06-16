import ToolRepository from "../repositories/toolRepository.js";


class ToolService {
    constructor() {
        this.toolRepository =  new ToolRepository();
    }

    async createTool(toolData) {
        try {
            const existingTool = await this.toolRepository.findByName(toolData.name);
            if(existingTool) {
                throw new Error("Tool with this name already exists");
            }
            const tool = await this.toolRepository.create(toolData);
            return tool;
        }
            catch (error) {
                throw error;
            }
    }

    async createBulkTools(toolsData) {
            const results = {
                created: [],
                failed: [],
                total: toolsData.length
            }

        for (const toolData of toolsData) { 
            try { 
                const tool = await this.createTool(toolData);
                results.created.push(tool);
            }  catch (error) {
                results.failed.push({ toolData, error: error.message });
            }   
        }
    return results;
    }

    async getAllTools(filter, options) {
        try {
            const tools = await this.toolRepository.findAll(filter, options);
            return tools;
        } catch (error) {
            throw error;
        } 
    }
}