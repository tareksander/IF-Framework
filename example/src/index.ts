import "@if-framework/framework/styles/default-font.scss";
import "@if-framework/framework/styles/default.scss";

import { History, Main, Theme, define, updater } from "@if-framework/framework/choice";
import { Moment, engine } from "@if-framework/framework/choice";
// Generated from the passages directory by the Webpack plugin
import passages from "./passages";
import { DEBUG } from "./env";

// The theme should be set before loading the rest of the document, to prevent a flash of unstyled content.
/*
let theme: Theme = engine.loadTheme() ?? {
    background: "black",
    link: "black",
    linkVisited: "black",
    text: "black",
    uiPrimary: "black",
    uiSecondary: "black",
};

engine.applyTheme(theme);
*/

let init = () => {
    // Add the generated passages to the engine.
    // For generated passages, the passage name is the file name without the extension.
    engine.addPassages(passages);
    
    // Set the starting point with an initial history.
    // This creates a new History with the current Moment at index 0 and a Moment list with only
    // one Moment at the "test" passage and with empty local variables.
    engine.initHistory(new History([new Moment("test", {})], 0));
    
    
    // Define the custom elements used in Markdown passages.
    define();
    
    // Remove the default Javascript warning.
    document.getElementById("iff-noscript-container")?.remove();
    
    // Initialize the default UI.
    new Main({
        target: document.body,
        props: {
            // Additional components to be displayed in the sidebar can be added here. A Svelte component constructor is expected.
            sidebarComponents: [],
            // Header and footer components can be added, too.
            header: null,
            footer: null,
        }
    });
    
    // Only use the service worker in release builds, to make testing easier.
    if (! DEBUG) {
        updater.register().catch((e) => console.log(e));
    }
};


// Run the actual initialization once the document has loaded.
if (document.readyState == "loading") {
    window.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

