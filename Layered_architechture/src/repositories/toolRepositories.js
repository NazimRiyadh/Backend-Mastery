import BaseRepository from "./baseRepository.js"
import Tool from "../models/toolSchema.js"



class ToolRepository extends BaseRepository {
    constructor() {
        super(Tool)
    }

    /**
     * This method returns Tool by Tool Name
     * @param {*} name - Tool name
     * @returns 
     */
    async findByName(name) {
        return await this.findOne({ name })
    }


    async findByCategory(category) {
        return await Tool.findByCategory(category);
    }

    async search(searchQuery = "postman") {
        return await this.findAll({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
                { tags: { $in: [new RegExp(searchQuery, 'i')] } }
            ]
        });
    }
}

export default ToolRepository;