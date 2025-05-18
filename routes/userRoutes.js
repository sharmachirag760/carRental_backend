const express = require('express');
const { registerUser, loginUser, updateProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/userAuthMiddleware');
const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.put('/updateprofile',protect, updateProfile);
router.put('/changepassword',protect, changePassword);
module.exports = router;