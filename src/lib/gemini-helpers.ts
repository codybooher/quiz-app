import { generateContent, generateContentStream } from './gemini';
import type { GeminiModel } from './types/gemini';

/**
 * Analyzes text sentiment using Gemini AI
 * @param text - The text to analyze
 * @returns Sentiment analysis (positive, negative, or neutral)
 */
export async function analyzeSentiment(
	text: string
): Promise<{ sentiment: string; explanation: string }> {
	const prompt = `Analyze the sentiment of the following text and respond with ONLY a JSON object containing "sentiment" (positive, negative, or neutral) and "explanation" fields. Text: "${text}"`;

	const response = await generateContent(prompt);
	try {
		return JSON.parse(response);
	} catch {
		return { sentiment: 'unknown', explanation: response };
	}
}

/**
 * Summarizes long text using Gemini AI
 * @param text - The text to summarize
 * @param maxLength - Maximum length of summary in words (default: 100)
 * @returns Summarized text
 */
export async function summarizeText(text: string, maxLength: number = 100): Promise<string> {
	const prompt = `Summarize the following text in no more than ${maxLength} words: ${text}`;
	return generateContent(prompt);
}

/**
 * Translates text to a target language
 * @param text - The text to translate
 * @param targetLanguage - Target language (e.g., 'Spanish', 'French')
 * @returns Translated text
 */
export async function translateText(text: string, targetLanguage: string): Promise<string> {
	const prompt = `Translate the following text to ${targetLanguage}: ${text}`;
	return generateContent(prompt);
}

/**
 * Generates creative content based on a topic
 * @param topic - The topic to write about
 * @param type - Type of content (story, poem, essay, etc.)
 * @returns Generated creative content
 */
export async function generateCreativeContent(
	topic: string,
	type: 'story' | 'poem' | 'essay' | 'article' = 'story'
): Promise<string> {
	const prompt = `Write a creative ${type} about: ${topic}`;
	return generateContent(prompt, 'gemini-2.5-flash');
}

/**
 * Answers questions based on provided context
 * @param context - The context information
 * @param question - The question to answer
 * @returns Answer based on the context
 */
export async function answerQuestion(context: string, question: string): Promise<string> {
	const prompt = `Based on the following context, answer the question.

Context: ${context}

Question: ${question}

Answer:`;
	return generateContent(prompt);
}

/**
 * Extracts key points from text
 * @param text - The text to extract key points from
 * @param numberOfPoints - Number of key points to extract (default: 5)
 * @returns Array of key points
 */
export async function extractKeyPoints(
	text: string,
	numberOfPoints: number = 5
): Promise<string[]> {
	const prompt = `Extract ${numberOfPoints} key points from the following text. Return them as a JSON array of strings: ${text}`;

	const response = await generateContent(prompt);
	try {
		return JSON.parse(response);
	} catch {
		return response.split('\n').filter((line) => line.trim());
	}
}

/**
 * Generates a chat response with conversation history
 * @param messages - Array of previous messages in the conversation
 * @param newMessage - The new user message
 * @returns AI response considering conversation context
 */
export async function chatWithHistory(
	messages: Array<{ role: 'user' | 'assistant'; content: string }>,
	newMessage: string
): Promise<string> {
	const conversationHistory = messages
		.map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
		.join('\n');

	const prompt = `Continue this conversation naturally:

${conversationHistory}
User: ${newMessage}
Assistant:`;

	return generateContent(prompt);
}

/**
 * Improves or rewrites text
 * @param text - The text to improve
 * @param instruction - Specific instruction for improvement (e.g., "make it more professional")
 * @returns Improved version of the text
 */
export async function improveText(text: string, instruction?: string): Promise<string> {
	const basePrompt = `Improve the following text${instruction ? ` by ${instruction}` : ''}:

${text}

Improved version:`;

	return generateContent(basePrompt);
}

/**
 * Generates quiz questions from text content
 * @param content - The content to generate questions from
 * @param numberOfQuestions - Number of questions to generate (default: 5)
 * @returns Array of quiz questions with answers
 */
export async function generateQuizQuestions(
	content: string,
	numberOfQuestions: number = 5
): Promise<Array<{ question: string; answer: string; options?: string[] }>> {
	const prompt = `Generate ${numberOfQuestions} quiz questions from the following content. Return as a JSON array with objects containing "question", "answer", and optionally "options" (array of 4 choices for multiple choice). Content: ${content}`;

	const response = await generateContent(prompt);
	try {
		return JSON.parse(response);
	} catch {
		return [];
	}
}

/**
 * Streams a response with typing effect
 * @param prompt - The prompt to send
 * @param onUpdate - Callback for each update
 * @param delayMs - Delay between chunks in milliseconds (default: 50)
 * @param model - The model to use
 */
export async function streamWithTypingEffect(
	prompt: string,
	onUpdate: (text: string) => void,
	delayMs: number = 50,
	model: GeminiModel = 'gemini-2.5-flash'
): Promise<void> {
	let accumulated = '';

	await generateContentStream(
		prompt,
		async (chunk) => {
			accumulated += chunk;
			onUpdate(accumulated);
			await new Promise((resolve) => setTimeout(resolve, delayMs));
		},
		model
	);
}
