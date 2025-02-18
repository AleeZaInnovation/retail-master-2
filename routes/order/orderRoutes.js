const router = require('express').Router()
const orderController = require('../../controllers/order/orderController')
const { authMiddleware } = require('../../middlewares/authMiddleware')

// ---- customer
router.post('/order/confirm-purchase', authMiddleware, orderController.purchase_confirm)
router.get('/order/get-purchases', authMiddleware, orderController.get_purchases)
router.get('/order/get-purchase/:purchaseId', orderController.get_purchase)
router.post('/order/place-order', authMiddleware, orderController.place_order)
router.get('/order/get-company-orders', authMiddleware, orderController.get_company_orders)
router.get('/order/get-company-order/:orderId', orderController.get_company_order)
router.get('/order/get-branch-orders', authMiddleware, orderController.get_branch_orders)
router.get('/order/get-order/:orderId', orderController.get_order)
router.post('/order/make-draft', authMiddleware, orderController.make_draft)
router.get('/order/get-branch-drafts', authMiddleware, orderController.get_branch_drafts)
router.get('/order/get-company-drafts', authMiddleware, orderController.get_company_drafts)
router.get('/order/get-draft/:draftId', orderController.get_draft)
router.delete('/order/remove-draft/:draftId', orderController.remove_draft)
router.get('/home/customer/gat-dashboard-data/:userId', orderController.get_customer_databorad_data)
router.get('/home/customer/gat-orders/:customerId/:status', orderController.get_orders)
router.get('/order/confirm/:orderId', orderController.order_confirm)
router.post('/order/make-service', authMiddleware, orderController.make_service)
router.get('/order/get-branch-services', authMiddleware, orderController.get_branch_services)
router.get('/order/get-company-services', authMiddleware, orderController.get_company_services)
router.get('/order/get-company-service/:serviceId', orderController.get_company_service)
router.put('/order/service-update', authMiddleware, orderController.update_status)

// --- admin
router.get('/admin/orders', orderController.get_admin_orders)
router.get('/admin/order/:orderId', orderController.get_admin_order)
router.put('/admin/order-status/update/:orderId', orderController.admin_order_status_update)

// ---seller

router.get('/seller/orders/:sellerId', orderController.get_seller_orders)
router.get('/seller/order/:orderId', orderController.get_seller_order)
router.put('/seller/order-status/update/:orderId', orderController.seller_order_status_update)

module.exports = router