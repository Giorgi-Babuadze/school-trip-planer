import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Tour from '../models/Tour';

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find().populate('tourId');
    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error,
    });
  }
};

export const getBookingsByTourId = async (req: Request, res: Response) => {
  try {
    const { tourId } = req.params;
    const bookings = await Booking.find({ tourId }).populate('tourId');
    
    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error,
    });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { tourId, studentName, studentEmail, parentName, parentEmail, parentPhone, numberOfParticipants, totalPrice, notes } = req.body;
    
    // Check if tour exists and has available spots
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found',
      });
    }
    
    if (tour.currentParticipants + numberOfParticipants > tour.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Not enough available spots for this tour',
      });
    }
    
    const newBooking = new Booking({
      tourId,
      studentName,
      studentEmail,
      parentName,
      parentEmail,
      parentPhone,
      numberOfParticipants,
      totalPrice,
      notes,
    });
    
    await newBooking.save();
    
    // Update tour's current participants
    tour.currentParticipants += numberOfParticipants;
    await tour.save();
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: newBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error,
    });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedBooking = await Booking.findByIdAndUpdate(id, updates, { new: true }).populate('tourId');
    
    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
      error,
    });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }
    
    // Update tour's current participants
    const tour = await Tour.findById(booking.tourId);
    if (tour) {
      tour.currentParticipants -= booking.numberOfParticipants;
      await tour.save();
    }
    
    await Booking.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
      error,
    });
  }
};
