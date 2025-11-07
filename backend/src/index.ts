
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI, Type } from "@google/genai";
import { Task, TaskCategory, TaskStatus } from '../types';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3001;

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "A concise, descriptive title for the development task.",
        },
        description: {
          type: Type.STRING,
          description: "A brief explanation of why this task is necessary, based on the user's prompt.",
        },
        confidence: {
          type: Type.NUMBER,
          description: "A score from 0 to 100 representing the AI's confidence that this task is essential.",
        },
        category: {
          type: Type.STRING,
          enum: Object.values(TaskCategory),
          description: "The area of development this task falls under.",
        },
      },
      required: ["title", "description", "confidence", "category"],
    },
  };

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../dist')));

app.post('/api/generate', async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (process.env.TESTING === 'true') {
    const mockTasks = [
      {
        id: '1',
        title: 'Mock Task 1',
        description: 'This is a mock task.',
        status: TaskStatus.Pending,
        category: TaskCategory.General,
        confidence: 90,
      },
    ];
    return res.json(mockTasks);
  }
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: {
            parts: [{ text: prompt }]
        },
        config: {
          systemInstruction: `You are an AI assistant for Project NEXUS, an autonomous development agent. Your role is to break down a high-level user request into a structured list of development tasks. Respond ONLY with a valid JSON array matching the provided schema. Each task should be a logical step in building the described application. Assign a confidence score from 0 to 100 based on how essential and well-defined the task is. Categorize each task appropriately. Do not include any explanatory text before or after the JSON array.`,
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Invalid response from Gemini API. Response text is empty.");
      }
      const jsonString = text.trim();
      const parsedResponse: Omit<Task, 'id' | 'status'>[] = JSON.parse(jsonString);

      if (!Array.isArray(parsedResponse)) {
          throw new Error("Invalid response format from Gemini API. Expected an array.");
      }

      const tasks = parsedResponse.map((taskData, index) => ({
        ...taskData,
        id: `${Date.now()}-${index}`,
        status: taskData.confidence > 60 ? TaskStatus.Pending : TaskStatus.AwaitingApproval,
        category: Object.values(TaskCategory).includes(taskData.category as TaskCategory) ? taskData.category as TaskCategory : TaskCategory.General
      }));

    res.json(tasks);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to generate task list from the backend.' });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
