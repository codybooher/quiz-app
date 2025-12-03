import type { ScoreColor } from '$lib/types/quiz';

/**
 * Calculates the percentage score
 */
export function getPercentage(score: number, total: number): number {
	return Math.round((score / total) * 100);
}

/**
 * Gets the score color based on percentage
 */
export function getScoreColor(percentage: number): ScoreColor {
	if (percentage >= 80) return 'green';
	if (percentage >= 60) return 'yellow';
	return 'red';
}

/**
 * Formats timestamp to readable date string
 */
export function formatDate(timestamp: number): string {
	const date = new Date(timestamp);
	return (
		date.toLocaleDateString() +
		' ' +
		date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	);
}

/**
 * Gets the emoji based on score percentage
 */
export function getScoreEmoji(percentage: number): string {
	if (percentage >= 80) return '🎉';
	if (percentage >= 60) return '👍';
	return '📚';
}
