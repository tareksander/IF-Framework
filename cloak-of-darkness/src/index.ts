import "./styles.scss";

import { History, Main, config, define, updater } from "@if-framework/framework/choice";
import { Moment, engine } from "@if-framework/framework/choice";
// Generated from the passages directory by the Webpack plugin
import passages from "./passages";
import { DEBUG } from "./env";
import Header from "./header.svelte";


let init = () => {
    // The history is used on the background to navigate back from the cloak examination passage.
    // More history isn't needed here, so we set the limit to 2.
    config.historyLimit = 2;
    // Make sure the user can't navigate the history - otherwise escaping the dark room would be trivial.
    config.userNavigable.set(false);
    
    // Add the generated passages to the engine.
    // For generated passages, the passage name is the file name without the extension.
    engine.addPassages(passages);
    
    // Set the starting point with an initial history.
    // This creates a new History with the current Moment at index 0 and a Moment list with only
    // one Moment at the "test" passage and with empty local variables.
    engine.init(new History([new Moment("start", {})], 0), 0);
    
    
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
            // Add your custom header component here, that displays the current location.
            header: Header,
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

