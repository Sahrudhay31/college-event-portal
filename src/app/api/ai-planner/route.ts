import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
            return NextResponse.json(
                { error: 'Gemini API Key is not configured. Please add it to your .env.local file.' },
                { status: 500 }
            );
        }

        const systemInstruction = `You are an expert AI Event Planner. Given an event description, generate a detailed logistics plan in JSON format.
Your output MUST be valid JSON matching exactly this schema:
{
  "title": "A short, catchy title for the event",
  "budget": [
    { "item": "Name of expense category", "cost": "$Amount" }
  ],
  "totalBudget": "$TotalAmount",
  "volunteers": "Description of volunteers and staffing needed",
  "venues": [
    { "name": "Venue name", "pros": "Pros of this venue", "cons": "Cons of this venue" }
  ],
  "timeline": [
    { "time": "e.g. Day -30", "task": "Task description" }
  ],
  "marketing": {
    "socialMedia": "A catchy social media caption with emojis",
    "email": "A professional but exciting email draft",
    "poster": "Inspiration or text layout for a poster"
  }
}
Provide realistic estimates and creative marketing copy. Ensure budget totals make sense.`;

        const model = genAI.getGenerativeModel({
            model: 'gemini-flash-latest',
            systemInstruction: systemInstruction,
            generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.7,
            }
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        if (!text) {
            throw new Error('No response from Gemini');
        }

        const plan = JSON.parse(text);

        return NextResponse.json({ plan }, { status: 200 });

    } catch (error: any) {
        console.error('AI Planner Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate event plan' },
            { status: 500 }
        );
    }
}
