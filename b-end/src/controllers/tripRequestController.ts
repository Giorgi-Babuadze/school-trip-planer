import { Request, Response } from 'express';
import TripRequest, { ITripRequest } from '../models/TripRequest';

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

// Calculate estimated cost based on budget
const calculateEstimatedCost = (budget: string, participants: number, duration: number): number => {
  const budgetRates: { [key: string]: number } = {
    budget: 125,    // ₾125 per person per day
    medium: 200,    // ₾200 per person per day
    premium: 300,   // ₾300 per person per day
  };

  const dailyRate = budgetRates[budget] || 200;
  return dailyRate * participants * duration;
};

// Create trip request
export const createTripRequest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const { destination, date, duration, participants, budget, notes } = req.body;

    // Validation
    if (!destination || !date || !duration || !participants) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Check for duplicate pending/approved requests on same date
    const existingRequest = await TripRequest.findOne({
      userId: req.user.id,
      date: new Date(date),
      status: { $in: ['pending', 'approved'] },
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a trip request for this date',
      });
    }

    const estimatedCost = calculateEstimatedCost(budget, participants, duration);

    const newTripRequest = new TripRequest({
      userId: req.user.id,
      destination,
      date: new Date(date),
      duration,
      participants,
      budget,
      notes,
      estimatedCost,
    });

    await newTripRequest.save();

    res.status(201).json({
      success: true,
      message: 'Trip request created successfully',
      data: newTripRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating trip request',
      error,
    });
  }
};

// Get user's trip requests
export const getUserTripRequests = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const requests = await TripRequest.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trip requests',
      error,
    });
  }
};

// Get all trip requests (admin only)
export const getAllTripRequests = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    const requests = await TripRequest.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trip requests',
      error,
    });
  }
};

// Get trip request by ID
export const getTripRequestById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const { id } = req.params;
    const request = await TripRequest.findById(id).populate('userId', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Trip request not found',
      });
    }

    // Check if user is owner or admin
    if (request.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this request',
      });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trip request',
      error,
    });
  }
};

// Update trip request status (admin only)
export const updateTripRequestStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const request = await TripRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('userId', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Trip request not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating trip request',
      error,
    });
  }
};

// Delete trip request
export const deleteTripRequest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const { id } = req.params;
    const request = await TripRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Trip request not found',
      });
    }

    // Check if user is owner or admin
    if (request.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this request',
      });
    }

    // Only allow deletion if pending
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only delete pending requests',
      });
    }

    await TripRequest.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Trip request deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting trip request',
      error,
    });
  }
};
