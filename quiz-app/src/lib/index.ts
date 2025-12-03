// place files you want to import through the `$lib` alias in this folder.

// Core Gemini utilities
export { generateContent, generateContentStream, generateContentWithOptions } from './gemini';
export type { GeminiOptions } from './gemini';

// Helper functions for common use cases
export {
	analyzeSentiment,
	answerQuestion,
	chatWithHistory,
	extractKeyPoints,
	generateCreativeContent,
	generateQuizQuestions,
	improveText,
	streamWithTypingEffect,
	summarizeText,
	translateText
} from './gemini-helpers';

// Type definitions
export { GeminiAIError } from './types/gemini';
export type {
	GeminiError,
	GeminiGenerationConfig,
	GeminiModel,
	GeminiResponse,
	StreamCallback
} from './types/gemini';
