import { env } from '$env/dynamic/private';
import { GoogleGenAI } from '@google/genai';

/**
 * Initialize the Gemini AI client
 * @returns GoogleGenAI client instance
 */
function getGeminiClient(): GoogleGenAI {
	const apiKey = env.GEMINI_API_KEY;
	if (!apiKey) {
		throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env file.');
	}
	return new GoogleGenAI({ apiKey });
}

/**
 * Generate content from a text prompt using Gemini AI
 * @param prompt - The text prompt to send to Gemini
 * @param model - The Gemini model to use (default: gemini-2.5-flash)
 * @returns The generated text response
 */
export async function generateContent(
	prompt: string,
	model: string = 'gemini-2.5-flash'
): Promise<string> {
	const client = getGeminiClient();

	const response = await client.models.generateContent({
		model,
		contents: prompt
	});

	return response.text || '';
}

/**
 * Generate content with streaming response
 * @param prompt - The text prompt to send to Gemini
 * @param onChunk - Callback function to handle each chunk of text as it arrives
 * @param model - The Gemini model to use (default: gemini-2.5-flash)
 */
export async function generateContentStream(
	prompt: string,
	onChunk: (text: string) => void,
	model: string = 'gemini-2.5-flash'
): Promise<void> {
	const client = getGeminiClient();

	const stream = await client.models.generateContentStream({
		model,
		contents: prompt
	});

	for await (const chunk of stream) {
		const text = chunk.text;
		if (text) {
			onChunk(text);
		}
	}
}

/**
 * Type for Gemini AI configuration options
 */
export interface GeminiOptions {
	model?: string;
	temperature?: number;
	topK?: number;
	topP?: number;
	maxOutputTokens?: number;
}

/**
 * Generate content with custom configuration options
 * @param prompt - The text prompt to send to Gemini
 * @param options - Configuration options for the generation
 * @returns The generated text response
 */
export async function generateContentWithOptions(
	prompt: string,
	options: GeminiOptions = {}
): Promise<string> {
	const client = getGeminiClient();
	const { model = 'gemini-2.5-flash', ...generationConfig } = options;

	const response = await client.models.generateContent({
		model,
		contents: prompt,
		config: generationConfig
	});

	return response.text || '';
}
