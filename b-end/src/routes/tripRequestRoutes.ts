import express from 'express';
import {
  createTripRequest,
  getUserTripRequests,
  getAllTripRequests,
  getTripRequestById,
  updateTripRequestStatus,
  deleteTripRequest,
} from '../controllers/tripRequestController';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// User routes
router.post('/', verifyToken, createTripRequest);
router.get('/user/requests', verifyToken, getUserTripRequests);
router.get('/:id', verifyToken, getTripRequestById);
router.delete('/:id', verifyToken, deleteTripRequest);

// Admin routes
router.get('/', verifyToken, getAllTripRequests);
router.put('/:id/status', verifyToken, updateTripRequestStatus);

export default router;
