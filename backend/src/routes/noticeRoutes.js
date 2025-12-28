import express from 'express';
import { createNotice, updateNotice, getAllNoticesUser, getAllNoticesAdmin } from '../controllers/noticeController.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import upload from '../middleware/multerConfig.js';

const router = express.Router();

router.post('/create',upload.single('file'), adminMiddleware, createNotice);
router.patch('/update/:id', upload.single('file'), adminMiddleware, updateNotice);
router.get('/all', getAllNoticesUser);
router.get('/admin/all', adminMiddleware, getAllNoticesAdmin);


export default router;