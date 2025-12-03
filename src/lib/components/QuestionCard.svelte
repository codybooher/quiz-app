<script lang="ts">
	import type { Question } from '$lib/types/quiz';

	type Props = {
		question: Question;
		index: number;
		totalQuestions: number;
		userAnswer: string | undefined;
		isSubmitted: boolean;
		isDisabled: boolean;
		onAnswerChange: (answer: string) => void;
	};

	let {
		question,
		index,
		totalQuestions,
		userAnswer,
		isSubmitted,
		isDisabled,
		onAnswerChange
	}: Props = $props();
</script>

<div class="rounded-lg border-2 border-gray-200 bg-white p-6 shadow-sm">
	<div class="mb-4 flex items-start justify-between">
		<h2 class="text-lg font-bold text-gray-800">
			Question {index + 1} of {totalQuestions}
		</h2>
		{#if isSubmitted}
			{@const isCorrect = userAnswer === question.correctAnswer}
			<span
				class="rounded-full px-3 py-1 text-sm font-semibold {isCorrect
					? 'bg-green-100 text-green-700'
					: 'bg-red-100 text-red-700'}"
			>
				{isCorrect ? '✓ Correct' : '✗ Incorrect'}
			</span>
		{/if}
	</div>

	<p class="mb-4 text-lg font-semibold text-gray-700">{question.question}</p>

	<div class="mb-4 space-y-3">
		{#each question.options as option}
			{@const isSelected = userAnswer === option.label}
			{@const isCorrectOption = option.label === question.correctAnswer}
			{@const showAsCorrect = isSubmitted && isCorrectOption}
			{@const showAsIncorrect = isSubmitted && isSelected && userAnswer !== question.correctAnswer}

			<label
				class="block rounded-md border-2 p-4 transition-all {showAsCorrect
					? 'border-green-500 bg-green-50'
					: showAsIncorrect
						? 'border-red-500 bg-red-50'
						: isSelected
							? 'border-blue-500 bg-blue-50'
							: 'border-gray-200 bg-gray-50 hover:border-gray-300'} {isDisabled ? 'cursor-default' : 'cursor-pointer'}"
			>
				<div class="flex items-center gap-3">
					<input
						type="radio"
						name="question-{index}"
						value={option.label}
						checked={userAnswer === option.label}
						onchange={() => {
							if (!isDisabled) {
								onAnswerChange(option.label);
							}
						}}
						disabled={isDisabled}
						class="h-5 w-5 accent-blue-500 {isDisabled ? 'cursor-default' : 'cursor-pointer'}"
					/>
					<div class="flex-1">
						<span class="font-bold text-gray-700">{option.label}.</span>
						<span class="ml-2 text-gray-700">{option.text}</span>
					</div>
					{#if showAsCorrect}
						<span class="text-sm font-semibold text-green-600">✓ Correct Answer</span>
					{:else if showAsIncorrect}
						<span class="text-sm font-semibold text-red-600">✗ Your Answer</span>
					{/if}
				</div>
			</label>
		{/each}
	</div>

	<!-- Explanation (shown after submission) -->
	{#if isSubmitted}
		<div class="rounded-md border-l-4 border-blue-500 bg-blue-50 p-4">
			<h3 class="mb-2 font-semibold text-blue-900">Explanation:</h3>
			<p class="text-blue-800">{question.explanation}</p>
			
			{#if question.sources && question.sources.length > 0}
				<div class="mt-3 border-t border-blue-200 pt-3">
					<h4 class="mb-2 text-sm font-semibold text-blue-900">Sources:</h4>
					<ul class="space-y-1">
						{#each question.sources as source}
							<li class="text-sm">
								<a
									href={source.url}
									target="_blank"
									rel="noopener noreferrer"
									class="text-blue-700 underline hover:text-blue-900"
								>
									{source.title}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	{/if}
</div>

