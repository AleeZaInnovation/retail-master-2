const router = require('express').Router();
const authControllers = require('../controllers/authControllers');
const { authMiddleware } = require('../middlewares/authMiddleware');


router.post('/super-admin-login', authControllers.super_admin_login)
router.post('/forget-password', authControllers.forgot_password)
router.post('/reset-password', authControllers.reset_password)
router.put('/change-password', authMiddleware, authControllers.change_password)
router.post('/owner-register', authControllers.owner_register)
router.post('/owner-login', authControllers.owner_login)
router.post('/staff-register', authControllers.staff_register)
router.post('/staff-login', authControllers.staff_login)
router.get('/get-user', authMiddleware, authControllers.getUser)
router.post('/profile-image-upload',authMiddleware, authControllers.profile_image_upload)
router.put('/profile-info-add',authMiddleware, authControllers.profile_info_add)

router.get('/logout',authMiddleware,authControllers.logout)

module.exports = router;