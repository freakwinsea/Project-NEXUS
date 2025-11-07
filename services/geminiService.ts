
import { GoogleGenAI, Type } from "@google/genai";
import { Task, TaskStatus, TaskCategory } from '../types';

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

export const generateTaskList = async (prompt: string): Promise<Task[]> => {
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

    const jsonString = response.text.trim();
    const parsedResponse: Omit<Task, 'id' | 'status'>[] = JSON.parse(jsonString);

    if (!Array.isArray(parsedResponse)) {
        throw new Error("Invalid response format from Gemini API. Expected an array.");
    }
    
    return parsedResponse.map((taskData, index) => ({
      ...taskData,
      id: `${Date.now()}-${index}`,
      status: taskData.confidence > 60 ? TaskStatus.Pending : TaskStatus.AwaitingApproval,
      category: Object.values(TaskCategory).includes(taskData.category as TaskCategory) ? taskData.category as TaskCategory : TaskCategory.General
    }));
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate task list. The AI model might be unavailable or the request was malformed.");
  }
};
