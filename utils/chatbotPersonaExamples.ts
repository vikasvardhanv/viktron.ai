/**
 * Example: Using chatbot personas in your AI service calls
 * 
 * This shows how to integrate the use-case specific personas
 * with your Gemini or other AI service calls.
 */

import { getChatbotPersona, getChatbotGreeting } from '../utils/chatbotPersonas';

// Example 1: Initialize chatbot with use-case specific greeting
export const initializeDemoChatbot = (
  useCase: string,
  companyName: string
): { greeting: string; systemInstruction: string } => {
  const greeting = getChatbotGreeting(useCase, companyName);
  const systemInstruction = getChatbotPersona(useCase, companyName);
  
  return { greeting, systemInstruction };
};

// Example 2: Use in Gemini API call
export const getDemoChatbotResponse = async (
  userMessage: string,
  useCase: string,
  companyName: string,
  conversationHistory: Array<{ role: string; content: string }>
) => {
  const systemInstruction = getChatbotPersona(useCase, companyName);
  
  // Use with Google Gemini
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
    },
    body: JSON.stringify({
      contents: [
        ...conversationHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    })
  });
  
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

// Example 3: Demo component using personas
/**
 * In your demo page component:
 * 
 * ```tsx
 * import { useState, useEffect } from 'react';
 * import { Chatbot } from '../components/Chatbot';
 * import { getChatbotGreeting } from '../utils/chatbotPersonas';
 * 
 * const CustomerSupportDemo = () => {
 *   const [chatHistory, setChatHistory] = useState([]);
 *   const useCase = 'customer_support';
 *   const companyName = 'Acme Corp';
 *   
 *   useEffect(() => {
 *     // Initialize with greeting
 *     const greeting = getChatbotGreeting(useCase, companyName);
 *     setChatHistory([{
 *       sender: 'bot',
 *       text: greeting,
 *       timestamp: new Date()
 *     }]);
 *   }, []);
 *   
 *   return (
 *     <Chatbot
 *       useCase={useCase}
 *       companyName={companyName}
 *       chatHistory={chatHistory}
 *       // ... other props
 *     />
 *   );
 * };
 * ```
 */

// Example 4: Parse use_case from demo URL
export const parseDemoParams = () => {
  const params = new URLSearchParams(window.location.search);
  
  return {
    useCase: params.get('use_case') || 'custom',
    companyName: params.get('company') || 'Demo Company',
    industry: params.get('industry') || undefined,
    demoId: params.get('id') || undefined,
  };
};

// Example 5: Store demo configuration in session storage
export const saveDemoConfig = (config: {
  useCase: string;
  companyName: string;
  websiteUrl?: string;
  industry?: string;
}) => {
  sessionStorage.setItem('demo_config', JSON.stringify(config));
};

export const loadDemoConfig = () => {
  const stored = sessionStorage.getItem('demo_config');
  return stored ? JSON.parse(stored) : null;
};
