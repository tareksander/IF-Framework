<script lang="ts" context="module">
    /**
     * Controls whether the save UI is available to the player.
     */
    export const userSavable = writable(true);
</script>
<script lang="ts">
    import { derived, get, writable } from "svelte/store";
    import { engine } from "../engine";
    import { config } from "../config";
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
    
</script>

<div style="border-right: 2px solid var(--ui-primary-color); height: 100%">
    <h2 style="border: 1px solid var(--ui-primary-color); border-right: 0px; padding: 0.5em; text-align: center; margin: 0px;">
        {$title}
    </h2>
    <div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <a on:click={back} style="border: 2px solid {$backColor}; border-right: 1px solid {$backColor}; border-top: 1px solid {$backColor}; color: {$backColor}">←</a><!-- svelte-ignore a11y-missing-attribute --><!-- svelte-ignore a11y-click-events-have-key-events --><!-- svelte-ignore a11y-no-static-element-interactions --><a on:click={forward} style="border: 2px solid {$forwardColor}; border-left: 1px solid {$forwardColor}; border-top: 1px solid {$forwardColor}; color: {$forwardColor}">→</a>
    </div>
    {#each components as c}
        <svelte:component this={c}/>
    {/each}
</div>

<style lang="css">
    a {
        padding: 0.5em;
        align-content: center;
        display: inline-block;
        user-select: none;
        font-size: 1.5rem;
    }
</style>