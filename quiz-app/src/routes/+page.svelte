<script lang="ts">
	import QuestionCard from '$lib/components/QuestionCard.svelte';
	import QuizHistorySidebar from '$lib/components/QuizHistory.svelte';
	import ScoreDisplay from '$lib/components/ScoreDisplay.svelte';
	import type { Question, QuizHistory } from '$lib/types/quiz';
	import { onMount } from 'svelte';

	let topic = $state('');
	let isLoading = $state(false);
	let error = $state('');
	let questions = $state<Question[]>([]);
	let userAnswers = $state<Record<number, string>>({});
	let isSubmitted = $state(false);
	let score = $state(0);
	let quizHistory = $state<QuizHistory[]>([]);
	let selectedHistoryId = $state<string | null>(null);
	let showHistory = $state(true);

	/**
	 * Load quiz history from localStorage on mount
	 */
	onMount(() => {
		loadQuizHistory();
	});

	/**
	 * Loads quiz history from localStorage
	 */
	function loadQuizHistory() {
		try {
			const stored = localStorage.getItem('quizHistory');
			if (stored) {
				quizHistory = JSON.parse(stored);
			}
		} catch (err) {
			console.error('Error loading quiz history:', err);
		}
	}

	/**
	 * Saves quiz history to localStorage
	 */
	function saveQuizHistory() {
		try {
			localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
		} catch (err) {
			console.error('Error saving quiz history:', err);
		}
	}

	/**
	 * Generates 5 multiple choice questions by calling the server API
	 */
	async function generateQuiz() {
		if (!topic.trim()) {
			error = 'Please enter a topic for the quiz';
			return;
		}

		isLoading = true;
		error = '';
		questions = [];
		userAnswers = {};
		isSubmitted = false;
		score = 0;
		selectedHistoryId = null;

		try {
			// Call the server endpoint
			const response = await fetch('/api/generate-question', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ topic: topic.trim() })
			});

			const data = await response.json();

			// Check if the request was successful
			if (!response.ok) {
				throw new Error(data.error || 'Failed to generate quiz');
			}

			// Set the questions from the response
			questions = data.questions;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to generate quiz';
			console.error('Error generating quiz:', err);
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Submits all answers and calculates the score
	 */
	function submitQuiz() {
		// Check if all questions are answered
		const unansweredQuestions = questions.filter((_, index) => !userAnswers[index]);

		if (unansweredQuestions.length > 0) {
			error = `Please answer all questions before submitting (${unansweredQuestions.length} remaining)`;
			return;
		}

		error = '';
		isSubmitted = true;

		// Calculate score
		let correctCount = 0;
		questions.forEach((question, index) => {
			if (userAnswers[index] === question.correctAnswer) {
				correctCount++;
			}
		});

		score = correctCount;

		// Save to history
		const historyEntry: QuizHistory = {
			id: Date.now().toString(),
			topic: topic,
			questions: questions,
			userAnswers: { ...userAnswers },
			score: score,
			totalQuestions: questions.length,
			timestamp: Date.now()
		};

		quizHistory = [historyEntry, ...quizHistory];
		saveQuizHistory();

		// Scroll to top to show score
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	/**
	 * Loads a quiz from history
	 */
	function loadHistoryQuiz(historyEntry: QuizHistory) {
		topic = historyEntry.topic;
		questions = historyEntry.questions;
		userAnswers = { ...historyEntry.userAnswers };
		score = historyEntry.score;
		isSubmitted = true;
		selectedHistoryId = historyEntry.id;
		error = '';

		// Scroll to top
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	/**
	 * Deletes a quiz from history
	 */
	function deleteHistoryEntry(id: string, event: Event) {
		event.stopPropagation();

		if (confirm('Are you sure you want to delete this quiz from history?')) {
			quizHistory = quizHistory.filter((entry) => entry.id !== id);
			saveQuizHistory();

			// If viewing the deleted quiz, reset
			if (selectedHistoryId === id) {
				resetQuiz();
			}
		}
	}

	/**
	 * Clears all quiz history
	 */
	function clearAllHistory() {
		if (confirm('Are you sure you want to clear all quiz history?')) {
			quizHistory = [];
			saveQuizHistory();
			if (selectedHistoryId) {
				resetQuiz();
			}
		}
	}

	/**
	 * Resets the entire quiz
	 */
	function resetQuiz() {
		topic = '';
		questions = [];
		userAnswers = {};
		isSubmitted = false;
		score = 0;
		error = '';
		selectedHistoryId = null;
	}

	/**
	 * Generates a new quiz with the same topic
	 */
	function tryAgain() {
		userAnswers = {};
		isSubmitted = false;
		score = 0;
		selectedHistoryId = null;
		generateQuiz();
	}

	/**
	 * Toggles history sidebar visibility
	 */
	function toggleHistory() {
		showHistory = !showHistory;
	}

	/**
	 * Handles answer selection for a question
	 */
	function handleAnswerChange(index: number, answer: string) {
		userAnswers[index] = answer;
	}
</script>

<div class="flex min-h-screen">
	<!-- Main Content -->
	<div class="flex-1 p-6 {showHistory ? 'mr-80' : ''}">
		<div class="mx-auto max-w-4xl">
			<div class="mb-4 flex items-center justify-between">
				<h1 class="text-3xl font-bold text-gray-800">Quiz Generator</h1>
				<button
					onclick={toggleHistory}
					class="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
				>
					{showHistory ? 'Hide' : 'Show'} History
				</button>
			</div>

			<!-- Score Display (shown after submission) -->
			{#if isSubmitted}
				<ScoreDisplay score={score} totalQuestions={questions.length} isHistoryView={selectedHistoryId !== null} />
			{/if}

			<!-- Topic Input -->
			<div class="mb-6">
				<label for="topic" class="mb-2 block font-semibold text-gray-700">
					Enter a topic for your quiz:
				</label>
			<input
				id="topic"
				type="text"
				bind:value={topic}
				disabled={isLoading || (questions.length > 0 && !isSubmitted) || selectedHistoryId !== null}
				placeholder="e.g., photosynthesis, World War II, JavaScript promises..."
				class="w-full rounded-md border-2 border-gray-300 p-3 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
				onkeydown={(e) => {
					if (e.key === 'Enter' && !isLoading && topic.trim() && questions.length === 0 && !selectedHistoryId) {
						generateQuiz();
					}
				}}
			/>
			</div>

			<!-- Error Display -->
			{#if error}
				<div class="mb-4 rounded-md bg-red-100 p-4 text-red-700">
					<strong>Error:</strong>
					{error}
				</div>
			{/if}

			<!-- Action Buttons -->
			<div class="mb-6 flex gap-3">
				{#if questions.length === 0 && !selectedHistoryId}
					<button
						onclick={generateQuiz}
						disabled={isLoading || !topic.trim()}
						class="rounded-md bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isLoading ? 'Generating Quiz...' : 'Generate Quiz (5 Questions)'}
					</button>
				{/if}

				{#if questions.length > 0 && !isSubmitted}
					<button
						onclick={submitQuiz}
						class="rounded-md bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-600"
					>
						Submit Quiz
					</button>
					<button
						onclick={resetQuiz}
						class="rounded-md bg-gray-500 px-6 py-3 font-semibold text-white hover:bg-gray-600"
					>
						Reset
					</button>
				{/if}

				{#if isSubmitted && !selectedHistoryId}
					<button
						onclick={tryAgain}
						class="rounded-md bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-600"
					>
						Try Another Quiz
					</button>
					<button
						onclick={resetQuiz}
						class="rounded-md bg-gray-500 px-6 py-3 font-semibold text-white hover:bg-gray-600"
					>
						Change Topic
					</button>
				{/if}

				{#if selectedHistoryId}
					<button
						onclick={resetQuiz}
						class="rounded-md bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-600"
					>
						Start New Quiz
					</button>
				{/if}
			</div>

			<!-- Loading State -->
			{#if isLoading}
				<div class="rounded-md border-2 border-blue-200 bg-blue-50 p-6">
					<div class="flex items-center gap-3">
						<div
							class="h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
						></div>
						<p class="text-blue-700">Generating your quiz questions...</p>
					</div>
				</div>
			{/if}

			<!-- Questions Display -->
			{#if questions.length > 0}
				<div class="space-y-6">
					{#each questions as question, index}
						<QuestionCard
							{question}
							{index}
							totalQuestions={questions.length}
							userAnswer={userAnswers[index]}
							{isSubmitted}
							isDisabled={isSubmitted || selectedHistoryId !== null}
							onAnswerChange={(answer) => handleAnswerChange(index, answer)}
						/>
					{/each}
				</div>

				<!-- Submit Button at Bottom (before submission) -->
				{#if !isSubmitted && !selectedHistoryId}
					<div class="mt-6">
						<button
							onclick={submitQuiz}
							class="w-full rounded-md bg-blue-500 px-6 py-4 text-lg font-semibold text-white hover:bg-blue-600"
						>
							Submit All Answers
						</button>
					</div>
				{/if}
			{/if}

			<!-- Tips -->
			{#if !questions.length && !isLoading}
				<div class="mt-8 rounded-md bg-gray-50 p-4 text-sm text-gray-600">
					<p class="mb-2">
						<strong>Tip:</strong> Try different topics like:
					</p>
					<ul class="list-inside list-disc space-y-1">
						<li>Science: "Photosynthesis", "Newton's Laws", "DNA replication"</li>
						<li>History: "American Revolution", "Ancient Rome", "Industrial Revolution"</li>
						<li>Technology: "JavaScript closures", "Machine learning", "Cloud computing"</li>
						<li>General: "Geography of Asia", "Famous composers", "Olympic sports"</li>
					</ul>
				</div>
			{/if}
		</div>
	</div>

	<!-- History Sidebar -->
	{#if showHistory}
		<QuizHistorySidebar
			history={quizHistory}
			selectedId={selectedHistoryId}
			onLoadQuiz={loadHistoryQuiz}
			onDeleteEntry={deleteHistoryEntry}
			onClearAll={clearAllHistory}
			onClose={toggleHistory}
		/>
	{/if}
</div>
