# Quiz App

Everything you need to build a Svelte project with Gemini AI integration, powered by [`sv`](https://github.com/sveltejs/cli).

## Summary

Architecture and tools:

- Svelte/Sveltekit: I'm more familiar with JS frameworks and I have been wanting to experiment more with Svelte. When it comes to simple apps, Svelte is typically a better choice for performance over React.
- TailwindCSS: Lots of classes for styling. LLMs are familiar with it, making it easy to style elements.
- Gemini: Google has an excellent free tier and Gemini is great for search.

I used Cursor with Claude Sonnet 4.5 for most of the work. I picked these tools because they are the ones that I'm most familiar with and also because (in my experience) they are the best at coding.

Overall, this was a fun project to build! I was able to add in some of the bonus features:

- Quiz history: When a quiz is submitted it's saved to local storage. The user can then view their quiz history and select past quizzes. The user can also clear out their quiz history if they choose.
- Explanations and Citations: LLMs are prone to hallucinating answers to questions. To mitigate that risk, there are explanations for each of the answers after the quiz has been submitted. When available, sources cited and linked along with the explanation.
- Random topic: Sometimes it's fun to not have to type stuff out. The random topic button takes a topic from a list of predefined topics and generates a quiz.

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
