/**
 * Gemini AI Type Definitions
 * This file contains type definitions for the Gemini AI integration
 */

/**
 * Configuration options for Gemini AI content generation
 */
export interface GeminiGenerationConfig {
	/** The model to use for generation (e.g., 'gemini-2.5-flash') */
	model?: string;
	/** Controls randomness: 0 = deterministic, 1 = maximum randomness */
	temperature?: number;
	/** Number of highest probability vocabulary tokens to keep for top-k-filtering */
	topK?: number;
	/** Probability mass to keep for top-p-filtering */
	topP?: number;
	/** Maximum number of tokens to generate */
	maxOutputTokens?: number;
}

/**
 * Response from Gemini AI content generation
 */
export interface GeminiResponse {
	/** The generated text content */
	text: string;
	/** Additional metadata about the response */
	metadata?: {
		/** Token usage information */
		tokenCount?: number;
		/** Safety ratings */
		safetyRatings?: Array<{
			category: string;
			probability: string;
		}>;
	};
}

/**
 * Error types that can occur during Gemini AI operations
 */
export type GeminiError =
	| 'INVALID_API_KEY'
	| 'RATE_LIMIT_EXCEEDED'
	| 'CONTENT_FILTERED'
	| 'NETWORK_ERROR'
	| 'UNKNOWN_ERROR';

/**
 * Error class for Gemini AI operations
 */
export class GeminiAIError extends Error {
	type: GeminiError;

	constructor(message: string, type: GeminiError = 'UNKNOWN_ERROR') {
		super(message);
		this.name = 'GeminiAIError';
		this.type = type;
	}
}

/**
 * Callback function type for streaming responses
 */
export type StreamCallback = (chunk: string) => void;

/**
 * Available Gemini models
 */
export type GeminiModel =
	| 'gemini-2.5-flash'
	| 'gemini-2.5-pro'
	| 'gemini-2.0-flash'
	| 'gemini-1.5-pro'
	| 'gemini-1.5-flash';
