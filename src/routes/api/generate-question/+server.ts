import { env } from '$env/dynamic/private';
import { GoogleGenAI } from '@google/genai';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * POST endpoint to generate quiz questions
 * Generates 5 questions on the given topic
 * Keeps the API key private on the server
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const { topic } = await request.json();

		// Validate input
		if (!topic || typeof topic !== 'string' || !topic.trim()) {
			return json({ error: 'Topic is required and must be a non-empty string' }, { status: 400 });
		}

		// Check API key configuration
		const apiKey = env.GEMINI_API_KEY;
		if (!apiKey) {
			console.error('GEMINI_API_KEY is not configured');
			return json({ error: 'Server configuration error: API key not configured' }, { status: 500 });
		}

		// Initialize Gemini client
		const client = new GoogleGenAI({ apiKey });

		// Build the prompt for 5 questions
		const prompt = buildPrompt(topic.trim());

		// Generate content
		const response = await client.models.generateContent({
			model: 'gemini-2.5-flash',
			contents: prompt
		});

		const responseText = response.text || '';

		// Parse and validate response
		const parsedQuestions = parseResponse(responseText);

		// Return the parsed questions
		return json({ success: true, questions: parsedQuestions });
	} catch (error) {
		console.error('Error generating questions:', error);

		// Return appropriate error message
		const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

		return json({ error: errorMessage }, { status: 500 });
	}
};

/**
 * Builds a comprehensive prompt for generating 5 multiple choice questions
 */
function buildPrompt(topic: string): string {
	return `You are an expert educational content creator. Generate exactly 5 high-quality multiple choice questions based on the following topic: "${topic}"

REQUIREMENTS:
1. Question Quality:
   - Create clear, concise, and unambiguous questions
   - Ensure questions test understanding, not just memorization
   - Use proper grammar and punctuation
   - Avoid trick questions or overly complex wording
   - Make each question unique and cover different aspects of the topic

2. Answer Options:
   - Provide exactly 4 options (A, B, C, D) for each question
   - Make all options plausible and similar in length
   - Ensure only ONE option is definitively correct
   - Avoid options like "All of the above" or "None of the above"
   - Use simple, clear language that's easy to understand
   - Make distractors (wrong answers) educational and based on common misconceptions

3. Difficulty:
   - Target an intermediate difficulty level
   - Questions should be challenging but fair
   - Avoid obscure or overly technical details
   - Vary difficulty slightly across the 5 questions

4. Explanation:
   - Provide a brief explanation of why the correct answer is right
   - Keep explanations concise (2-3 sentences)

5. Sources:
   - Include 1-3 reputable sources that support the answer and explanation
   - Prefer authoritative sources like Wikipedia, educational institutions, scientific journals, or official documentation
   - Each source must include a descriptive title and a valid URL
   - Ensure URLs are accurate and point to specific, relevant pages

OUTPUT FORMAT (respond ONLY with valid JSON - an array of 5 question objects):
[
  {
    "question": "First question here?",
    "options": [
      { "label": "A", "text": "First option" },
      { "label": "B", "text": "Second option" },
      { "label": "C", "text": "Third option" },
      { "label": "D", "text": "Fourth option" }
    ],
    "correctAnswer": "A",
    "explanation": "Brief explanation of why this answer is correct.",
    "sources": [
      { "title": "Wikipedia - Topic Name", "url": "https://en.wikipedia.org/wiki/Topic_Name" },
      { "title": "Educational Source", "url": "https://example.edu/topic" }
    ]
  },
  {
    "question": "Second question here?",
    "options": [
      { "label": "A", "text": "First option" },
      { "label": "B", "text": "Second option" },
      { "label": "C", "text": "Third option" },
      { "label": "D", "text": "Fourth option" }
    ],
    "correctAnswer": "B",
    "explanation": "Brief explanation of why this answer is correct.",
    "sources": [
      { "title": "Wikipedia - Topic Name", "url": "https://en.wikipedia.org/wiki/Topic_Name" }
    ]
  },
  ... (continue for all 5 questions)
]

Generate all 5 questions now.`;
}

/**
 * Parses the Gemini response into an array of structured question objects
 */
function parseResponse(response: string) {
	// Try to extract JSON array from the response
	const jsonMatch = response.match(/\[[\s\S]*\]/);
	if (!jsonMatch) {
		throw new Error('Invalid response format from AI - no JSON array found');
	}

	const parsed = JSON.parse(jsonMatch[0]);

	// Validate that it's an array
	if (!Array.isArray(parsed)) {
		throw new Error('Response is not an array');
	}

	// Validate that we have exactly 5 questions
	if (parsed.length !== 5) {
		throw new Error(`Expected 5 questions, but got ${parsed.length}`);
	}

	// Validate each question structure
	for (let i = 0; i < parsed.length; i++) {
		const question = parsed[i];

		if (
			!question.question ||
			!question.options ||
			!Array.isArray(question.options) ||
			question.options.length !== 4 ||
			!question.correctAnswer ||
			!question.explanation ||
			!question.sources ||
			!Array.isArray(question.sources) ||
			question.sources.length === 0
		) {
			throw new Error(`Question ${i + 1} is missing required fields`);
		}

		// Validate options structure
		for (const option of question.options) {
			if (!option.label || !option.text) {
				throw new Error(`Question ${i + 1} has invalid option structure`);
			}
		}

		// Validate sources structure
		for (const source of question.sources) {
			if (!source.title || !source.url) {
				throw new Error(`Question ${i + 1} has invalid source structure`);
			}
		}
	}

	return parsed;
}
