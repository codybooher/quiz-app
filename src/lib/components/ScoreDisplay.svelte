<script lang="ts">
	import { getPercentage, getScoreColor, getScoreEmoji } from '$lib/utils/quiz-helpers';

	type Props = {
		score: number;
		totalQuestions: number;
		isHistoryView: boolean;
	};

	let { score, totalQuestions, isHistoryView }: Props = $props();

	const percentage = $derived(getPercentage(score, totalQuestions));
	const scoreColor = $derived(getScoreColor(percentage));
	const emoji = $derived(getScoreEmoji(percentage));
</script>

<div
	class="mb-6 rounded-lg border-2 p-6 shadow-lg {scoreColor === 'green'
		? 'border-green-500 bg-green-50'
		: scoreColor === 'yellow'
			? 'border-yellow-500 bg-yellow-50'
			: 'border-red-500 bg-red-50'}"
>
	<div class="flex items-center justify-between">
		<div>
			<h2
				class="text-2xl font-bold {scoreColor === 'green'
					? 'text-green-700'
					: scoreColor === 'yellow'
						? 'text-yellow-700'
						: 'text-red-700'}"
			>
				Your Score: {score} out of {totalQuestions}
			</h2>
			<p
				class="mt-1 text-lg {scoreColor === 'green'
					? 'text-green-600'
					: scoreColor === 'yellow'
						? 'text-yellow-600'
						: 'text-red-600'}"
			>
				{percentage}% Correct
			</p>
			{#if isHistoryView}
				<p class="mt-1 text-sm text-gray-600">Viewing saved quiz</p>
			{/if}
		</div>
		<div class="text-6xl">
			{emoji}
		</div>
	</div>
</div>
