const router = require('express').Router()
const { authMiddleware } = require('../../middlewares/authMiddleware')
const categoryController = require('../../controllers/dashboard/categoryController')

router.post('/category-add', authMiddleware, categoryController.add_category)
router.put('/category-update', authMiddleware, categoryController.update_category)
router.get('/categories-get', authMiddleware, categoryController.get_categories)
router.get('/category-get/:categoryId', authMiddleware, categoryController.get_category)
router.post('/inventory-add', authMiddleware, categoryController.add_inventory)
router.put('/inventory-update', authMiddleware, categoryController.update_inventory)
router.get('/inventories-get', authMiddleware, categoryController.get_inventories)
router.get('/inventory-get/:inventoryId', authMiddleware, categoryController.get_inventory)
router.get('/out-inventories-get', authMiddleware, categoryController.get_out_inventories)


module.exports = router