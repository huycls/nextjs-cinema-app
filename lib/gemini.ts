import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { useRouter } from 'next/router'; // Assuming you're using Next.js

// Initialize the API with error handling
const API_KEY = 'AIzaSyCXoHJWFriF0NusmCpIk7YP8Wqy2RLvkek';
let genAI: GoogleGenerativeAI;

try {
  genAI = new GoogleGenerativeAI(API_KEY);
} catch (error) {
  console.error('Failed to initialize Gemini API:', error);
  throw new Error('Failed to initialize AI service');
}

let chatSession: any = null;
const initialPrompt = "You are a friendly and knowledgeable movie expert. Answer questions about movies, actors, directors, and cinema in general. If you're not sure about something, be honest about it. Keep your responses focused on movies and cinema.";

const STORAGE_KEYS = {
  CHAT_HISTORY: 'movie_chat_history',
  INITIAL_PROMPT: 'movie_chat_initial_prompt',
};

const generationConfig = {
  maxOutputTokens: 1000,
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
};

async function createChatSession() {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash', // Updated to use gemini-2.0-flash model
    });

    return model.startChat({
      history: [
        {
          role: "user",
          parts: initialPrompt,
        },
        {
          role: "model",
          parts: "I understand. I'll act as a friendly and knowledgeable movie expert, providing accurate information about movies, actors, directors, and cinema. I'll be honest when I'm not certain about something.",
        },
      ],
      generationConfig,
    });
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw new Error('Failed to create chat session');
  }
}

export async function initChatSession() {
  try {
    chatSession = await createChatSession();
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.INITIAL_PROMPT, initialPrompt);
    }
    
    return chatSession;
  } catch (error) {
    console.error('Error initializing chat session:', error);
    throw new Error('Failed to initialize chat. Please try again later.');
  }
}

export async function cloneChatSession() {
  try {
    chatSession = await createChatSession();
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify([]));
    }
    
    return chatSession;
  } catch (error) {
    console.error('Error cloning chat session:', error);
    throw new Error('Failed to reset chat. Please try again later.');
  }
}

export async function chatWithGemini(message: string, router: any) {
  try {
    if (!chatSession) {
      await initChatSession();
    }

    if (!message.trim()) {
      throw new Error('Please enter a message');
    }

    // Check if the message contains the keyword
    const keywordRegex = /^Take me to (.*)$/i;
    const match = message.match(keywordRegex);
    if (match) {
      const searchQuery = match[1].trim();
      router.push(`/tim-kiem?keyword=${encodeURIComponent(searchQuery)}`);
      return `Redirecting to search results for "${searchQuery}"...`;
    }

    const result = await chatSession.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('Received empty response from AI');
    }
    
    return text;
  } catch (error) {
    console.error('Error in chat session:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Authentication failed. Please try again later.');
      }
      if (error.message.includes('quota')) {
        throw new Error('Service temporarily unavailable. Please try again later.');
      }
      if (error.message.includes('blocked')) {
        throw new Error('Message was blocked by safety settings. Please try rephrasing.');
      }
      // If session seems invalid, try to recreate it
      if (error.message.includes('session') || error.message.includes('connection')) {
        chatSession = null;
        throw new Error('Connection lost. Please try again.');
      }
      
      throw error; // Rethrow the original error if it's not a special case
    }
    
    throw new Error('An unexpected error occurred. Please try again.');
  }
}

export interface ChatMessage {
  text: string;
  isBot: boolean;
}

export function saveMessagesToStorage(messages: ChatMessage[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }
}

export function loadMessagesFromStorage(): ChatMessage[] {
  if (typeof window !== 'undefined') {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      return savedMessages ? JSON.parse(savedMessages) : [];
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  }
  return [];
}
