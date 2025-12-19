
import express from 'express';
import { LoginAdmin, registerAdmin, verifyAdminToken } from '../controllers/adminController.js';


const router = express.Router();


router.post('/admin/create',registerAdmin)
router.post('/admin/login',LoginAdmin)
router.get('/admin/verify', verifyAdminToken)
export default router;