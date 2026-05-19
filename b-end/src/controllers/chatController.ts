import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Chat, { IChat } from '../models/Chat';
import TrainingData from '../models/TrainingData';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Get or create chat session
export const getChat = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    let chat = await Chat.findOne({ userId });
    
    if (!chat) {
      const user = (req as any).user;
      chat = new Chat({
        userId,
        userName: user?.name || 'User',
        messages: [],
      });
      await chat.save();
    }

    res.status(200).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat',
    });
  }
};

// Send message to bot
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty',
      });
    }

    // Get or create chat
    let chat = await Chat.findOne({ userId });
    if (!chat) {
      const user = (req as any).user;
      chat = new Chat({
        userId,
        userName: user?.name || 'User',
        messages: [],
      });
    }

    // Add user message
    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Build context from training data
    const trainingData = await TrainingData.find().limit(10);
    let context = '';
    if (trainingData.length > 0) {
      context = trainingData
        .map((td) => `[${td.category}] ${td.title}: ${td.content}`)
        .join('\n\n');
    }

    // Get response from Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const systemPrompt = context
      ? `You are a helpful assistant for a school trip planner. Use the following information to answer questions:\n\n${context}\n\nBe helpful, friendly, and provide useful information about school trips and related services.`
      : 'You are a helpful assistant for a school trip planner. Be friendly and provide useful information about school trips and related services.';

    // Build conversation history for context
    const conversationHistory = chat.messages.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chatSession = model.startChat({
      history: conversationHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    const result = await chatSession.sendMessage(systemPrompt + '\n\nUser: ' + message);
    const responseText = result.response.text();

    // Add assistant message
    chat.messages.push({
      role: 'assistant',
      content: responseText,
      timestamp: new Date(),
    });

    // Save chat
    await chat.save();

    res.status(200).json({
      success: true,
      data: {
        userMessage: message,
        assistantMessage: responseText,
        chat,
      },
    });
  } catch (error) {
    console.error('Send message error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: errorMessage,
    });
  }
};

// Get chat history
export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const chat = await Chat.findOne({ userId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    res.status(200).json({
      success: true,
      data: chat.messages,
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat history',
    });
  }
};

// Clear chat history
export const clearChat = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const chat = await Chat.findOneAndUpdate(
      { userId },
      { messages: [] },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chat cleared successfully',
      data: chat,
    });
  } catch (error) {
    console.error('Clear chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear chat',
    });
  }
};
