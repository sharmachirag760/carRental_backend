const express = require('express');
const { protect } = require('../middleware/adminAuthMiddleware');
const { registerAdmin, loginAdmin, changePassword, updateProfile, getProfile } = require('../controllers/adminController');
const router = express.Router();

router.post('/register',registerAdmin);
router.post('/login',loginAdmin);
router.get('/getprofile',protect, getProfile);
router.put('/updateprofile',protect, updateProfile);
router.put('/changepassword',protect, changePassword);
module.exports = router;
//hi