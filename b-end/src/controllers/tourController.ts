import { Request, Response } from 'express';
import Tour from '../models/Tour';

export const getAllTours = async (req: Request, res: Response) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      success: true,
      data: tours,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tours',
      error,
    });
  }
};

export const getTourById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);
    
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: tour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tour',
      error,
    });
  }
};

export const createTour = async (req: Request, res: Response) => {
  try {
    const { title, description, destination, price, duration, maxParticipants, startDate, endDate, image, itinerary, includes } = req.body;
    
    const newTour = new Tour({
      title,
      description,
      destination,
      price,
      duration,
      maxParticipants,
      startDate,
      endDate,
      image,
      itinerary,
      includes,
    });
    
    await newTour.save();
    
    res.status(201).json({
      success: true,
      message: 'Tour created successfully',
      data: newTour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating tour',
      error,
    });
  }
};

export const updateTour = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedTour = await Tour.findByIdAndUpdate(id, updates, { new: true });
    
    if (!updatedTour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Tour updated successfully',
      data: updatedTour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating tour',
      error,
    });
  }
};

export const deleteTour = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const deletedTour = await Tour.findByIdAndDelete(id);
    
    if (!deletedTour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Tour deleted successfully',
      data: deletedTour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting tour',
      error,
    });
  }
};
