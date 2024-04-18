# IF Framework

A modular framework for developing interactive fiction with modern [Typescript](https://www.typescriptlang.org/) and [Svelte](https://svelte.dev/).



## Roadmap

- [ ] Choice-based games
  - [x] Default UI with a closable sidebar and custom sidebar elements, headers and footers.
  - [x] Passage generator from Markdown files.
  - [x] Passage aggregator, collecting all passages from a folder for easy adding to the engine.
  - [ ] Save/Load UI
  - [ ] Yeoman project template
- [ ] Common Functionality
  - [x] Installable as PWAs
  - [x] Offline capable
  - [x] Extensible save system
  - [x] Update notifications
  - [ ] Packaging as a native app via Tauri
- [ ] Parser games: If I find the time and motivation to learn about & make them.



## Concepts

### Choice-Based

#### Passages and History

If you're coming from Twine, the passage and history system should feel familiar.

If you're coming from a Web developer perspective, the history system is essentially an emulation of the Browser history for your story, with the addition that local variables are saved and restored, too, when you load from storage. Passages are the engines routing system, because a story is essentially a single page application. That also means you can abuse the system as much as you like and theoretically render all your content dynamically yourself in one "passage", or save the current Moment while going to another passage and restore it when going back, e.g. for games where the history size is normally 1 (and the last passage would have been lost).


#### Service Worker

A simple service worker template is included in the `service.ts` module. It works together with hte `Updater` to check for story updates and provides offline capability.  
For that to work you have to include a `config.json` file in the directory of the output HTML file, as well as the `service.js` file built from the service.  
The `version` field is a number and should start at 0. Each time you make a new release, you'll have to increment it to make the service worker pick up on the update.  
The `cacheFiles` field contains the paths of files to cache relative to the `config.json`. You have to add all your build outputs, so they'll be available offline.



#### Saves

There are currently 2 save locations:
- [Session Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage): A temporary save is placed here after every history change, so that reloading the page doesn't lose progress.
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API): Here are the persistent save slots starting at 0, and the autosave slot with number -1.




## UI

There is currently no auto-generated documentation for the Svelte components, so you'll have to look at the component source for the doc comments.  
Some components like the sidebar export variables from the module via a `context="module"` script tag, those variables can be imported like normal.  
Exports in the main script tag are props you have to give to the component.



## Fonts

A default font for consistency is included and can be used by including `default-font.scss`. In addition you'll have to copy the `fonts` folder to the HTML output, the the stylesheet can find the fonts.

More fonts to choose may be available in the future.


