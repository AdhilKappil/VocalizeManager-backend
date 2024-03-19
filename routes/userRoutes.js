import express from 'express'
import { authUser, getUserProfile, logoutUser, updateUserProfile,registerUser, setUserProfile } from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js'
const router = express.Router();

router.post('/',registerUser)
router.post('/auth',authUser)
router.post('/logout',logoutUser)
router.route('/profile').get(protect,getUserProfile).put(protect,updateUserProfile) 
router.post('/addProfile', setUserProfile)

export default router;