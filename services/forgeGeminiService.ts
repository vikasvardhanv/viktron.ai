import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

// Initialize Gemini
const initGemini = () => {
  if (!genAI && API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
};

// Forge personality and context
const FORGE_SYSTEM_PROMPT = `You are Forge, an enthusiastic and helpful AI platform builder for Viktron. Your job is to help users create their own branded AI automation platform.

PERSONALITY:
- Friendly, enthusiastic, and encouraging
- Use emojis occasionally (🔨, 💪, 🎯, ✨, 🚀, etc.)
- Be conversational and warm
- Show genuine excitement about user's choices
- Keep responses concise but personable (2-4 sentences)

YOUR TASK:
Help users through these steps to create their AI platform:
1. Understand their sector/industry/expertise
2. Identify their target audience (Small Business, Enterprise, etc.)
3. Determine their automation focus (Customer Support, Marketing, Sales, All-in-One, etc.)

CONVERSATION STYLE:
- Ask ONE question at a time
- Acknowledge their previous answer before asking next question
- Be specific with praise ("Perfect! Small businesses NEED this!")
- Build excitement as you progress
- At the end, tell them you're generating their platform

IMPORTANT:
- Keep responses SHORT (2-4 sentences max)
- Always end with a clear question or next step
- Don't overwhelm with too much information
- Match the energy in the screenshot example provided

CONTEXT ABOUT THE PLATFORM:
Users are creating white-label AI automation platforms under their own branding at Viktron. The platform will include voice agents, chat agents, and automation tools for their chosen industry and audience.`;

export interface ForgeMessage {
  role: 'user' | 'model';
  parts: string;
}

export class GeminiForgeService {
  private model;
  private chat;
  private conversationHistory: ForgeMessage[] = [];

  constructor() {
    const ai = initGemini();
    if (!ai) {
      throw new Error('Gemini API key not configured');
    }
    
    this.model = ai.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 200, // Keep responses concise
      },
    });

    // Initialize chat with system prompt
    this.chat = this.model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: FORGE_SYSTEM_PROMPT }],
        },
        {
          role: 'model',
          parts: [{ text: "Got it! I'm Forge, ready to help users create their AI automation platform with enthusiasm and clarity. I'll ask one question at a time, keep responses short and energetic, and guide them through sector → audience → automation type. Let's make this fun! 🚀" }],
        },
      ],
    });
  }

  async sendMessage(userMessage: string): Promise<string> {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        parts: userMessage,
      });

      const result = await this.chat.sendMessage(userMessage);
      const response = result.response;
      const text = response.text();

      // Add model response to history
      this.conversationHistory.push({
        role: 'model',
        parts: text,
      });

      return text;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to get response from Forge');
    }
  }

  getConversationHistory(): ForgeMessage[] {
    return this.conversationHistory;
  }

  // Extract platform details from conversation
  extractPlatformDetails(): {
    sector?: string;
    targetAudience?: string;
    automationType?: string;
  } {
    const details: {
      sector?: string;
      targetAudience?: string;
      automationType?: string;
    } = {};

    // Simple extraction logic - can be enhanced
    const conversationText = this.conversationHistory
      .map(msg => msg.parts)
      .join(' ')
      .toLowerCase();

    // Target audience detection
    const audiences = ['small business', 'enterprise', 'marketing agenc', 'e-commerce', 'consultant', 'saas'];
    for (const audience of audiences) {
      if (conversationText.includes(audience)) {
        details.targetAudience = audience;
        break;
      }
    }

    // Automation type detection
    const automationTypes = [
      'customer support',
      'marketing',
      'sales',
      'lead gen',
      'operations',
      'workflow',
      'data analytics',
      'all-in-one',
    ];
    for (const type of automationTypes) {
      if (conversationText.includes(type)) {
        details.automationType = type;
        break;
      }
    }

    return details;
  }

  // Get initial greeting
  static getInitialGreeting(): string {
    return "Hey there! 👋\n\nI'm Forge, your AI platform builder.\n\nI can automatically create your white-label platform!\n\nWhat's your sector or expertise?";
  }
}

// Singleton instance
let forgeService: GeminiForgeService | null = null;

export const getForgeService = (): GeminiForgeService => {
  if (!forgeService) {
    forgeService = new GeminiForgeService();
  }
  return forgeService;
};

export const resetForgeService = (): void => {
  forgeService = null;
};

// Check if Gemini is configured
export const isGeminiConfigured = (): boolean => {
  return !!API_KEY && API_KEY !== 'your_api_key_here';
};
