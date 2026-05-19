import express from 'express';
import { getAllBookings, getBookingsByTourId, createBooking, updateBooking, deleteBooking } from '../controllers/bookingController';

const router = express.Router();

router.get('/', getAllBookings);
router.get('/tour/:tourId', getBookingsByTourId);
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

export default router;
