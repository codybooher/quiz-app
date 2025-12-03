# Quiz App

Everything you need to build a Svelte project with Gemini AI integration, powered by [`sv`](https://github.com/sveltejs/cli).

## Setup

1. Install dependencies:

```sh
npm install
```

2. Create a `.env` file in the project root:

```sh
GEMINI_API_KEY=your_api_key_here
```

Get your API key from [Google AI Studio](https://ai.google.dev/gemini-api/docs/quickstart).

## Gemini AI Integration

This project includes utilities for integrating with Google's Gemini AI API. The utilities are located in `src/lib/gemini.ts`.

### Available Functions

#### `generateContent(prompt, model?)`

Generate content from a text prompt using Gemini AI.

```typescript
import { generateContent } from '$lib';

const response = await generateContent('Explain how AI works in a few words');
console.log(response);
```

#### `generateContentStream(prompt, onChunk, model?)`

Generate content with streaming response for real-time text generation.

```typescript
import { generateContentStream } from '$lib';

await generateContentStream(
	'Tell me a story',
	(chunk) => {
		console.log(chunk); // Handle each chunk as it arrives
	},
	'gemini-2.5-flash'
);
```

#### `generateContentWithOptions(prompt, options?)`

Generate content with custom configuration options.

```typescript
import { generateContentWithOptions } from '$lib';

const response = await generateContentWithOptions('Write a poem', {
	model: 'gemini-2.5-flash',
	temperature: 0.7,
	maxOutputTokens: 1000
});
```

### Example Component

See `src/routes/gemini-example.svelte` for a complete example of how to use the Gemini utilities in a Svelte component.

## Developing

Start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Resources

- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs/quickstart)
- [SvelteKit Documentation](https://svelte.dev/docs/kit)
- [Svelte 5 Documentation](https://svelte.dev/docs/svelte)
