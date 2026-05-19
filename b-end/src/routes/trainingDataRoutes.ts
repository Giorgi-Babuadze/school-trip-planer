import express from 'express';
import {
  addTrainingData,
  getAllTrainingData,
  getTrainingDataByCategory,
  updateTrainingData,
  deleteTrainingData,
} from '../controllers/trainingDataController';
import { verifyToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Admin routes - require authentication and admin role
router.post('/', verifyToken, requireAdmin, addTrainingData);
router.get('/', verifyToken, requireAdmin, getAllTrainingData);
router.get('/category/:category', verifyToken, requireAdmin, getTrainingDataByCategory);
router.put('/:id', verifyToken, requireAdmin, updateTrainingData);
router.delete('/:id', verifyToken, requireAdmin, deleteTrainingData);

export default router;
