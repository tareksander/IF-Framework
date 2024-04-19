<script lang="ts">
    import { derived, get } from "svelte/store";
    import { engine } from "../engine";
    import { config } from "../config";
    import SaveDialog from "./saveDialog.svelte";
    import { overlays } from "./main.svelte";
    export let components: any[];
    
    let backColor = derived([engine.history, config.userNavigable], ([h, n]) => (h.currentIndex >= h.moments.length - 1 || ! n) ? "var(--ui-secondary-color)" : "var(--ui-primary-color)");
    let forwardColor = derived([engine.history, config.userNavigable], ([h, n]) => (h.currentIndex == 0 || ! n) ? "var(--ui-secondary-color)" : "var(--ui-primary-color)");
    
    let back = () => {
        let h = get(engine.history);
        if (h.currentIndex < h.moments.length - 1 && get(config.userNavigable)) {
            h.currentIndex += 1;
            engine.history.set(h);
        }
    };
    
    let forward = () => {
        let h = get(engine.history);
        if (h.currentIndex > 0 && get(config.userNavigable)) {
            h.currentIndex -= 1;
            engine.history.set(h);
        }
    };
    
    let title = engine.title;
    
    function reset() {
        engine.reset();
    }
    
    let us = config.userSavable;
    
    function saveDialog() {
        if (get(us)) {
            if (! get(overlays).find((o) => o.component === SaveDialog)) {
                overlays.set([...get(overlays), { component: SaveDialog, dismissible: true}]);
            }
        }
    }
    
</script>

<div style="border-right: 2px solid var(--ui-primary-color); height: 100%">
    <h2 style="border: 1px solid var(--ui-primary-color); border-right: 0px; padding: 0.5em; text-align: center; margin: 0px;">
        {$title}
    </h2>
    <div>
        <a on:click={back} style="border: 2px solid {$backColor}; border-right-width: 1px}; border-top-width: 1px; color: {$backColor}">←</a><a on:click={forward} style="border: 2px solid {$forwardColor}; border-left-width: 1px; border-top-width: 1px; color: {$forwardColor}">→</a>
    </div>
    <a class="button {$us ? "" : "disabled"}" on:click={saveDialog}>Save/Load</a>
    {#each components as c}
        <svelte:component this={c}/>
    {/each}
    <a class="button" on:click={reset}>Reset</a>
</div>

<style lang="css">
    .button {
        display: block;
        color: inherit;
        border: 2px solid var(--ui-primary-color);
        border-right-width: 0px;
        border-top-width: 1px;
    }
    
    .disabled {
        border-color: var(--ui-secondary-color);
        color: var(--ui-secondary-color);
    }
    
    a {
        padding: 0.5em;
        align-content: center;
        display: inline-block;
        user-select: none;
        font-size: 1.5rem;
    }
</style>