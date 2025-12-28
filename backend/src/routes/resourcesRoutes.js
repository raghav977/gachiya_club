import express from 'express';
import { createResourceAdmin,getAllResourcesAdmin,getAllResourcesUser,updateResourceAdmin } from '../controllers/resourceController.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import upload from '../middleware/multerConfig.js';

const router = express.Router();

router.post('/admin/create', adminMiddleware,upload.single('file'),createResourceAdmin);
router.patch('/admin/update/:id', adminMiddleware,upload.single('file'),updateResourceAdmin);
router.get('/all',getAllResourcesUser);
router.get('/admin/all',adminMiddleware,getAllResourcesAdmin);


export default router;