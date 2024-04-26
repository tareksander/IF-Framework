import { updater } from "../common/update";
import { default as Update } from "./update_dist.svelte";

// @ts-ignore
window.updater = updater;

window.addEventListener("DOMContentLoaded", () => {
    // @ts-ignore
    let e = new Update.element();
    document.body.append(e);
    
    updater.register();
});

