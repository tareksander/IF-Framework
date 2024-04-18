# IF Framework Example

The entry point is `src/index.ts`.  
A service worker is built from `src/service.ts`.  
`src/passages` contains the passages, the Markdown ones are converted to Svelte components on build.
`src/passages.ts` contains the list of passages generated from the passages directory, ready to be fed into the engine.  
`config.json` contains the list of outputs for the service worker to cache.  
`webpack.config.js` contains the webpack build code.  
`env.ts` contains definitions used in debug builds, `env-release.ts` is swapped in for it in release builds by webpack.

Run the development server with `npm run serve` and build the story with the service worker support with `npm run build`.

