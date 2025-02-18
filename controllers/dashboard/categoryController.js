const categoryModel = require('../../models/categoryModel');
const inventoryModel = require('../../models/inventoryModel');
const ownerModel = require('../../models/ownerModel')
const cloudinary = require('../../utils/cloudinaryConfig');
const { responseReturn } = require('../../utils/response')
const { formidable } = require('formidable');
const slugify = require("slugify");
const { mongo: { ObjectId } } = require('mongoose');
const staffModel = require('../../models/staffModel');

class inventoryController {
    add_category = async (req, res) => {
        const { id } = req;
        const form = formidable()
        form.parse(req, async (err, fields, files) => {

            if (err) {
                responseReturn(res, 404, { error: 'something error' })
            } else {
                let { name } = fields
                let { image } = files
                let filepath = image.map((item) => item.filepath);
                let path = filepath.toString()
                let title = name.toString()
                const slug = slugify(name.toString(), { replacement: "-", lower: true })
                const { companyId } = await ownerModel.findById(id);
                try {
                    const result = await cloudinary.uploader.upload(path, { folder: 'foodaleeza/category' })
                    if (result) {
                        const category = await categoryModel.create({
                            name: title,
                            slug: slug,
                            image: result.url,
                            companyId: new ObjectId(companyId)
                        })
                        responseReturn(res, 201, { category, message: 'Category added successfully' })
                    } else {
                        responseReturn(res, 404, { error: 'Image upload failed' })
                    }
                } catch (error) {
                    responseReturn(res, 500, { error: 'Internal server error' })
                }

            }
        })
    }

    update_category = async (req, res) => {
        const { id } = req;
        const form = formidable()
        form.parse(req, async (err, fields, files) => {

            if (err) {
                responseReturn(res, 404, { error: 'something error' })
            } else {
                let { name, categoryId } = fields
                let { image } = files
                let Id = categoryId.toString()
                const slug = slugify(name.toString(), { replacement: "-", lower: true })
                const { companyId } = await ownerModel.findById(id);
                try {

                    if (image !== undefined) {
                        const available = await categoryModel.findById(Id)
                        let temp = available.image.split('/')
                        temp = temp[temp.length - 1]
                        const imageName = temp.split('.')[0]
                        await cloudinary.uploader.destroy(imageName)
                        let filepath = image.map((item) => item.filepath);
                        let path = filepath.toString()
                        const result = await cloudinary.uploader.upload(path, { folder: 'foodaleeza/category' })
                        if (result) {
                            const category = await categoryModel.findByIdAndUpdate(Id, {
                                name: name.toString(),
                                slug: slug,
                                image: result.url,
                                companyId: new ObjectId(companyId)
                            })
                            responseReturn(res, 201, { category, message: 'Category updated successfully' })
                        } else {
                            responseReturn(res, 404, { error: 'Image upload failed' })
                        }
                    } else {
                        const category = await categoryModel.findByIdAndUpdate(Id, {
                            name: name.toString(),
                            slug: slug,
                            companyId: new ObjectId(companyId)
                        })
                        responseReturn(res, 201, { category, message: 'Category updated successfully' })
                    }
                } catch (error) {
                    responseReturn(res, 500, { error: 'Internal server error' })
                }

            }
        })
    }


    get_categories = async (req, res) => {
        const { id } = req;
        const { role } = req;
        if(role === "staff"){
            var { companyId } = await staffModel.findById(id);
        }else{
            var { companyId } = await ownerModel.findById(id);
        }
        const { page, searchValue, parPage } = req.query
        try {
            let skipPage = ''
            if (parPage && page) {
                skipPage = parseInt(parPage) * (parseInt(page) - 1)
            }
            if (searchValue && page && parPage) {
                const categories = await categoryModel.find({
                    $text: { $search: searchValue }, companyId: companyId
                }).skip(skipPage).limit(parPage).sort({ name: 1 })
                //console.log(categories)
                const totalCategory = await categoryModel.find({
                    $text: { $search: searchValue }, companyId: companyId
                }).countDocuments()
                //console.log(totalCategory)
                responseReturn(res, 200, { totalCategory, categories })
            }
            else if (searchValue === '' && page && parPage) {
                const categories = await categoryModel.find({ companyId: companyId }).skip(skipPage).limit(parPage).sort({ name: 1 })
                const totalCategory = await categoryModel.find({ companyId: companyId }).countDocuments()
                responseReturn(res, 200, { totalCategory, categories })
            }
            else {
                const categories = await categoryModel.find({ companyId: companyId }).sort({ name: 1 })
                const totalCategory = await categoryModel.find({ companyId: companyId }).countDocuments()
                responseReturn(res, 200, { totalCategory, categories })
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    get_category = async (req, res) => {
        const { categoryId } = req.params

        try {
            const category = await categoryModel.findById(categoryId)
            responseReturn(res, 200, { category })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    add_inventory = async (req, res) => {
        const { id } = req;
        const form = formidable()
        form.parse(req, async (err, fields, files) => {

            if (err) {
                responseReturn(res, 404, { error: 'something error' })
            } else {
                let { name, unit } = fields
                const { companyId } = await ownerModel.findById(id);
                try {
                    const inventory = await inventoryModel.create({
                        name: name.toString(),
                        unit: unit.toString(),
                        quantity: 0,
                        price: 0,
                        total: 0,
                        companyId: new ObjectId(companyId)
                    })
                    responseReturn(res, 201, { inventory, message: 'Inventory added successfully' })

                } catch (error) {
                    responseReturn(res, 500, { error: 'Internal server error' })
                }

            }
        })
    }

    update_inventory = async (req, res) => {
        const form = formidable()
        form.parse(req, async (err, fields, files) => {

            if (err) {
                responseReturn(res, 404, { error: 'something error' })
            } else {
                let { name, inventoryId, unit } = fields

                let Id = inventoryId.toString()
                try {

                    const inventory = await inventoryModel.findByIdAndUpdate(Id, {
                        name: name.toString(),
                        unit: unit.toString(),
                    })
                    responseReturn(res, 201, { inventory, message: 'Inventory updated successfully' })
                } catch (error) {
                    responseReturn(res, 500, { error: 'Internal server error' })
                }

            }
        })
    }


    get_inventories = async (req, res) => {
        const { id } = req;
        const { page, searchValue, parPage } = req.query
        try {
            const { companyId } = await ownerModel.findById(id);
            let skipPage = ''
            if (parPage && page) {
                skipPage = parseInt(parPage) * (parseInt(page) - 1)
            }
            if (searchValue && page && parPage) {
                const inventories = await inventoryModel.find({
                    $text: { $search: searchValue }, companyId: companyId
                }).skip(skipPage).limit(parPage).sort({ updatedAt: -1 })
                //console.log(inventories)
                const totalInventory = await inventoryModel.find({
                    $text: { $search: searchValue }, companyId: companyId
                }).countDocuments()
                //console.log(totalInventory)
                responseReturn(res, 200, { totalInventory, inventories })
            }
            else if (searchValue === '' && page && parPage) {
                const inventories = await inventoryModel.find({ companyId: companyId }).skip(skipPage).limit(parPage).sort({ updatedAt: -1 })
                const totalInventory = await inventoryModel.find({ companyId: companyId }).countDocuments()
                responseReturn(res, 200, { totalInventory, inventories })
            }
            else {
                const inventories = await inventoryModel.find({ companyId: companyId }).sort({ updatedAt: -1 })
                const totalInventory = await inventoryModel.find({ companyId: companyId }).countDocuments()
                responseReturn(res, 200, { totalInventory, inventories })
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    get_out_inventories = async (req, res) => {
        const { id } = req;
        const { page, searchValue, parPage } = req.query
        try {
            const { companyId } = await ownerModel.findById(id);
            let skipPage = ''
            if (parPage && page) {
                skipPage = parseInt(parPage) * (parseInt(page) - 1)
            }
            if (searchValue && page && parPage) {
                const inventories = await inventoryModel.find({
                    $text: { $search: searchValue }, companyId: companyId, quantity: { $lt: 0 }
                }).skip(skipPage).limit(parPage).sort({ updatedAt: -1 })
                //console.log(inventories)
                const totalInventory = await inventoryModel.find({
                    $text: { $search: searchValue }, companyId: companyId, quantity: { $lt: 0 }
                }).countDocuments()
                //console.log(totalInventory)
                responseReturn(res, 200, { totalInventory, inventories })
            }
            else if (searchValue === '' && page && parPage) {
                const inventories = await inventoryModel.find({ companyId: companyId, quantity: { $lt: 0 } }).skip(skipPage).limit(parPage).sort({ updatedAt: -1 })
                const totalInventory = await inventoryModel.find({ companyId: companyId, quantity: { $lt: 0 } }).countDocuments()
                responseReturn(res, 200, { totalInventory, inventories })
            }
            else {
                const inventories = await inventoryModel.find({ companyId: companyId, quantity: { $lt: 0 } }).sort({ updatedAt: -1 })
                const totalInventory = await inventoryModel.find({ companyId: companyId, quantity: { $lt: 0 } }).countDocuments()
                responseReturn(res, 200, { totalInventory, inventories })
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    get_inventory = async (req, res) => {
        const { inventoryId } = req.params

        try {
            const inventory = await inventoryModel.findById(inventoryId)
            responseReturn(res, 200, { inventory })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }
}

module.exports = new inventoryController()