<script lang="ts">
	import type { QuizHistory } from '$lib/types/quiz';
	import { formatDate, getPercentage, getScoreColor } from '$lib/utils/quiz-helpers';

	type Props = {
		history: QuizHistory[];
		selectedId: string | null;
		onLoadQuiz: (entry: QuizHistory) => void;
		onDeleteEntry: (id: string, event: Event) => void;
		onClearAll: () => void;
		onClose: () => void;
	};

	let { history, selectedId, onLoadQuiz, onDeleteEntry, onClearAll, onClose }: Props = $props();
</script>

<div
	class="fixed right-0 top-0 h-screen w-80 border-l-2 border-gray-200 bg-white shadow-lg overflow-y-auto"
>
	<div class="sticky top-0 border-b-2 border-gray-200 bg-white p-4">
		<div class="flex items-center justify-between">
			<h2 class="text-xl font-bold text-gray-800">Quiz History</h2>
			<button onclick={onClose} class="rounded-md p-1 hover:bg-gray-100" aria-label="Close history">
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>
		{#if history.length > 0}
			<button
				onclick={onClearAll}
				class="mt-2 text-sm text-red-600 hover:text-red-700 hover:underline"
			>
				Clear All History
			</button>
		{/if}
	</div>

	<div class="p-4">
		{#if history.length === 0}
			<div class="text-center text-gray-500">
				<p class="mb-2">No quiz history yet</p>
				<p class="text-sm">Complete a quiz to see it here!</p>
			</div>
		{:else}
			<div class="space-y-3">
				{#each history as entry}
					{@const percentage = getPercentage(entry.score, entry.totalQuestions)}
					{@const scoreColor = getScoreColor(percentage)}
					<div
						role="button"
						tabindex="0"
						onclick={() => onLoadQuiz(entry)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								onLoadQuiz(entry);
							}
						}}
						class="cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md {selectedId ===
						entry.id
							? 'border-blue-500 bg-blue-50'
							: 'border-gray-200 bg-gray-50 hover:border-gray-300'}"
					>
						<div class="mb-2 flex items-start justify-between">
							<h3 class="flex-1 font-semibold text-gray-800">{entry.topic}</h3>
							<button
								type="button"
								onclick={(e) => onDeleteEntry(entry.id, e)}
								class="ml-2 rounded-md p-1 text-gray-400 hover:bg-red-100 hover:text-red-600"
								aria-label="Delete quiz"
							>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
							</button>
						</div>
						<div
							class="mb-2 inline-block rounded-full px-2 py-1 text-sm font-semibold {scoreColor ===
							'green'
								? 'bg-green-100 text-green-700'
								: scoreColor === 'yellow'
									? 'bg-yellow-100 text-yellow-700'
									: 'bg-red-100 text-red-700'}"
						>
							{entry.score}/{entry.totalQuestions} ({percentage}%)
						</div>
						<p class="text-xs text-gray-500">{formatDate(entry.timestamp)}</p>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
