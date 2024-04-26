# IF Framework

A modular framework for developing interactive fiction with modern [Typescript](https://www.typescriptlang.org/) and [Svelte](https://svelte.dev/).


[Documentation for the Typescript files](https://tareksander.github.io/IF-Framework/framework/index.html).


## Roadmap

- [x] Choice-based games
  - [x] Default UI with a closable sidebar and custom sidebar elements, headers and footers.
  - [x] Passage generator from Markdown files.
  - [x] Passage aggregator, collecting all passages from a folder for easy adding to the engine.
  - [x] Save/Load UI
  - [x] [Project template](https://github.com/tareksander/IF-Framework-Template/tree/main)
- [ ] Common Functionality
  - [x] Installable as PWAs
  - [x] Offline capable
  - [x] Extensible save system
  - [x] Update notifications
  - [ ] Audio system
  - [ ] Packaging as a native app via Tauri
- [ ] Parser games
  - [ ] Text input/output UI
  - [ ] simple 2 word or 4 word parser
  - [ ] world model
  - [ ] Adventuron code integration


## Tutorial

For a commented example, see the [example project](https://github.com/tareksander/IF-Framework/tree/main/example).

To create a new project, you can use the [template](https://github.com/tareksander/IF-Framework-Template/tree/main).

## Concepts

### Choice-Based

#### Passages and History

If you're coming from Twine, the passage and history system should feel familiar.

If you're coming from a Web developer perspective, the history system is essentially an emulation of the Browser history for your story, with the addition that local variables are saved and restored, too, when you load from storage. Passages are the engines routing system, because a story is essentially a single page application. That also means you can abuse the system as much as you like and theoretically render all your content dynamically yourself in one "passage", or save the current Moment while going to another passage and restore it when going back, e.g. for games where the history size is normally 1 (and the last passage would have been lost).

#### Passage Formats

There are several passage formats available or in the works:

1. **Svelte**: The native passage format and the one all others get compiled into in the background. A passage is a Svelte Component with no props and optionally with 2 module exports (the `context="module"` script tag has to be the first in the file, and the exports have to be declared with `export const` on separate lines to be detected. If not detected, they are assumed empty. The detection is a simple regex, so if you e.g. have no meta export, but have a multiline string tag that has `export const meta =` at the start of a line, a meta object will be expected to be exported):
    1. A string array names `tags`: Here you can specify tags for the passage that can be queried later.
    2. A Javascript object named `meta`. Here you can put arbitrary passage metadata.
2. **Markdown**: This passage type converts Markdown to raw HTML and displays it. You can optionally include a `<meta>` tag at the very start that contains a JSON object with passage metadata. The `tags` field will become the passage tags array if specified.
3. **ChoiceScript**: This format converts a ChoiceScript snippet into a passage. Not implemented yet.


##### Passage Examples


Svelte:
````svelte
<script lang="ts" context="module">
    // Your can leave out this script tag, or one or both of meta and tags.
    export const meta = {};
    export const tags = [];
</script>
<script lang="ts">
    // Your typescript here
</script>
<!-- Your HTML here -->

<style lang="css">
    /* Your CSS code here */
</style>
````



#### Saves

There are currently 2 save locations:
- [Session Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage): A temporary save is placed here after every history change, so that reloading the page doesn't lose progress.
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API): Here are the persistent save slots starting at 0, and the autosave slot with number -1.

### Parser-Based

Not yet implemented. Will be based on Adventuron code and can be embedded into the choice-based UI.


### RPG Module

Not implemented yet.
If you're writing a parser game and the Adventuron world model isn't enough for you, or if you need a configurable world model in choice-based games, this module provides a configurable world model that is even suitable for RPGs if all features are enabled.


### Audio System

Not implemented yet.
Will allow you to play one-off sounds and music with volume control, fade-out, fade-in, etc.

### Service Worker

A simple service worker template is included in the `service.ts` module. It works together with the `Updater` to check for story updates and provides offline capability.  
For that to work you have to include a `config.json` file in the directory of the output HTML file, as well as the `service.js` file built from the service.  
The `version` field is a number and should start at 0. Each time you make a new release, you'll have to increment it to make the service worker pick up on the update.  
The `cacheFiles` field contains the paths of files to cache relative to the `config.json`. You have to add all your build outputs, so they'll be available offline.



## UI

There is currently no auto-generated documentation for the Svelte components, so you'll have to look at the component source for the doc comments.  
Some components export variables from the module via a `context="module"` script tag, those variables can be imported like normal.  
Exports in the main script tag are props you have to give to the component.



## Fonts

A default font for consistency is included and can be used by including `default-font.scss`. In addition you'll have to copy the appropriate font files from the `fonts` folder to the HTML output, so the stylesheet can find the fonts.

When including `default-font.scss` in a scss file, you can specify an array of fonts to load. The first one in the array is the default font for the whole page.


