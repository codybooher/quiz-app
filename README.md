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
