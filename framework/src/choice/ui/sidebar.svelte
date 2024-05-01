<script lang="ts">
    import { derived, get } from "svelte/store";
    import { engine } from "../engine";
    import { config } from "../config";
    import SaveDialog from "./saveDialogChoice.svelte";
    import { overlays } from "./main.svelte";
    export let components: any[];
    
    let back= derived([engine.history, config.userNavigable], ([h, n]) => (h.currentIndex >= h.moments.length - 1 || ! n));
    let forward = derived([engine.history, config.userNavigable], ([h, n]) => (h.currentIndex == 0 || ! n));
    let us = config.userSavable;
    let title = engine.title;
    
    let goBack = () => {
        let h = get(engine.history);
        if (h.currentIndex < h.moments.length - 1 && get(config.userNavigable)) {
            h.currentIndex += 1;
            engine.history.set(h);
        }
    };
    
    let goForward = () => {
        let h = get(engine.history);
        if (h.currentIndex > 0 && get(config.userNavigable)) {
            h.currentIndex -= 1;
            engine.history.set(h);
        }
    };
    
    
    function reset() {
        engine.reset();
    }
    
    
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
        <button on:click={goBack} disabled={$back} style="width: unset; display: inline;">←</button><button on:click={goForward} disabled={$forward} style="width: unset; display: inline; border-right-width: 1px;">→</button>
    </div>
    <button disabled={! $us} on:click={saveDialog}>Save/Load</button>
    {#each components as c}
        <svelte:component this={c}/>
    {/each}
    <button on:click={reset}>Reset</button>
</div>

<style lang="css">
    
    button:disabled {
        border-color: var(--ui-secondary-color);
        color: var(--ui-secondary-color);
    }
    
    button {
        padding: 0.5em;
        align-content: center;
        display: block;
        user-select: none;
        font-size: 1.5rem;
        display: block;
        color: inherit;
        border: 2px solid var(--ui-primary-color);
        background-color: inherit;
        border-right-width: 0px;
        border-top-width: 1px;
        width: 100%;
    }
    </style>