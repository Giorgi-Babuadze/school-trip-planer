import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import TrainingData from '../models/TrainingData.js';

dotenv.config();

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is missing from .env');

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });
    console.log('✅ Gemini model initialized');
  }

  async generateResponse(prompt: string, history: { role: string; text: string }[] = []) {
    try {
      // Load admin-added training entries from DB
      const trainingEntries = await TrainingData.find().lean();
      const customKnowledge = trainingEntries.length > 0
        ? '\n\nADMIN-ADDED KNOWLEDGE (treat these as facts):\n' +
          trainingEntries.map((e: any) => `[${e.category}] ${e.title}: ${e.content}`).join('\n\n')
        : '';

      const systemContext = `You are a helpful trip planning assistant for SchoolTrip.ge - a Georgian school trip planning website.

WEBSITE INFORMATION:
- Sign Up button: Top right corner of the page
- Plan Your Trip button: Top right, next to the AI Assistant chat button
- My Trips button: Appears after user logs in

HOW TO PLAN A TRIP:
1. Click "Sign Up" to create an account
2. Click "Plan Your Trip" button
3. Fill out the form:
   - Destinations (Sataplia, Gelati, Signagi, Motsameta)
   - Trip dates
   - Number of students and teachers
   - Transportation (auto-selected by student count)
   - Meals
   - Special requests
4. Click "Request Trip"
5. Admin reviews and approves your request
6. Check status in "My Trips"

VEHICLE RECOMMENDATIONS:
- 1–15 students: Minibus
- 16–40 students: Bus
- 40+ students: Multiple vehicles

DESTINATION PRICES (per student):
- Sataplia Nature Reserve: 35 GEL
- Gelati Monastery: 30 GEL
- Signagi: 45 GEL
- Motsameta: 25 GEL

MEAL PRICES (per student):
- Breakfast: 15 GEL
- Lunch: 25 GEL
- Dinner: 20 GEL${customKnowledge}

Answer in a friendly, helpful way. Help users plan their school trips with specific advice about destinations, costs, and logistics.`;

      const fullPrompt = history.length === 0
        ? `${systemContext}\n\nUser question: ${prompt}`
        : prompt;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('❌ Gemini API Error:', error);
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }
}

export default new GeminiService();