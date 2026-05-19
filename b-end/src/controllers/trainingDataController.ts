import { Request, Response } from 'express';
import TrainingData from '../models/TrainingData';

// Add training data (admin only)
export const addTrainingData = async (req: Request, res: Response) => {
  try {
    const { title, content, category } = req.body;
    const userId = (req as any).user?.id;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required',
      });
    }

    const trainingData = new TrainingData({
      title,
      content,
      category: category || 'general',
      createdBy: userId,
    });

    await trainingData.save();

    res.status(201).json({
      success: true,
      message: 'Training data added successfully',
      data: trainingData,
    });
  } catch (error) {
    console.error('Add training data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add training data',
    });
  }
};

// Get all training data (admin only)
export const getAllTrainingData = async (req: Request, res: Response) => {
  try {
    const trainingData = await TrainingData.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: trainingData,
    });
  } catch (error) {
    console.error('Get training data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve training data',
    });
  }
};

// Get training data by category
export const getTrainingDataByCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const { category } = req.params;

    const trainingData = await TrainingData.find({ category })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: trainingData,
    });
  } catch (error) {
    console.error('Get training data by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve training data',
    });
  }
};

// Update training data (admin only)
export const updateTrainingData = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;

    const trainingData = await TrainingData.findByIdAndUpdate(
      id,
      { title, content, category },
      { new: true }
    );

    if (!trainingData) {
      return res.status(404).json({
        success: false,
        message: 'Training data not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Training data updated successfully',
      data: trainingData,
    });
  } catch (error) {
    console.error('Update training data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update training data',
    });
  }
};

// Delete training data (admin only)
export const deleteTrainingData = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const trainingData = await TrainingData.findByIdAndDelete(id);

    if (!trainingData) {
      return res.status(404).json({
        success: false,
        message: 'Training data not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Training data deleted successfully',
    });
  } catch (error) {
    console.error('Delete training data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete training data',
    });
  }
};
