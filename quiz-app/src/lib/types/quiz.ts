/**
 * Represents a source/citation for a quiz question
 */
export type Source = {
	title: string;
	url: string;
};

/**
 * Represents a single quiz question with multiple choice options
 */
export type Question = {
	question: string;
	options: Array<{ label: string; text: string }>;
	correctAnswer: string;
	explanation: string;
	sources: Source[];
};

/**
 * Represents a completed quiz stored in history
 */
export type QuizHistory = {
	id: string;
	topic: string;
	questions: Question[];
	userAnswers: Record<number, string>;
	score: number;
	totalQuestions: number;
	timestamp: number;
};

/**
 * Color scheme for score display based on percentage
 */
export type ScoreColor = 'green' | 'yellow' | 'red';
