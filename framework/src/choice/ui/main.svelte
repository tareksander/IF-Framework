<script lang="ts" context="module">
    /**
     * An array of component constructors used to make dialogs that overlay over the page.
     * A constructor can only appear once.
     */
    export const overlays: Writable<Dialog[]> = writable([]);
</script>
<script lang="ts">
    import { fade } from "svelte/transition";
    import { engine } from "../engine";
    import { updater } from "../../common/update";
    import Update from "./update.svelte";
    import Sidebar, { userSavable } from "./sidebar.svelte";
    import { Writable, get, writable } from "svelte/store";
    import SaveDialog from "./saveDialog.svelte";
    import { Dialog } from "./dialog";
    
    export let sidebarComponents: any[];
    export let header: any|undefined;
    export let footer: any|undefined;
    
    const currentPassage = engine.currentPassage;
    const upd = updater.updateAvailable;
    const loading = engine.loading;
    
    function keyDown(e: KeyboardEvent) {
        if (e.ctrlKey && e.key.toLowerCase() == "s") {
            e.preventDefault();
            if (get(userSavable)) {
                if (! get(overlays).find((o) => o.component === SaveDialog)) {
                    overlays.set([...get(overlays), { component: SaveDialog, dismissible: true}]);
                } else {
                    overlays.set(get(overlays).filter((e) => e.component !== SaveDialog));
                }
            }
        }
        if (e.key === "Escape" && get(overlays).length != 0) {
            dismissDialog();
        }
    }
    
    function dismissDialog() {
        overlays.set([...(get(overlays).slice(0, -1))]);
    }
    
</script>

<svelte:window on:keydown={keyDown}/>

{#if $loading}
    <div class="content">
        Loading
    </div>
{:else}
    <div class="content">
        <div style="flex: 1;">
            <Sidebar components={sidebarComponents}/>
        </div>
        <div class="main">
            {#if header}
                <svelte:component this={header}/>
            {/if}
            <div class="passage">
                <svelte:component this={$currentPassage.component}/>
            </div>
            {#if footer}
                <svelte:component this={footer}/>
            {/if}
        </div>
    </div>
{/if}
{#if $upd}
    <div class="update" in:fade={{duration: 500}}>
        <Update></Update>
    </div>
{/if}
{#if $overlays.length != 0}
    {#each $overlays as o (o)}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="overlayBackground" on:click|self={dismissDialog}>
            <div class="overlayContainer">
                <svelte:component this={o.component}/>
            </div>
        </div>
    {/each}
{/if}

<style lang="css">
    
    .overlayContainer {
        background-color: var(--ui-secondary-color);
        border-radius: 20px;
        padding: 1em;
    }
    
    .overlayBackground {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 10vh 10vw;
        position: fixed;
        top: 0px;
        left: 0px;
        background-color: rgba(0, 0, 0, 0.4);
    }
    
    .content {
        display: flex;
        flex-direction: row;
        height: 100%;
    }
    
    .passage {
        padding: 1em;
        box-sizing: border-box;
        flex: 10;
    }
    
    .main {
        flex: 5;
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    
    
    .update {
        z-index: 100;
        position: absolute;
        right: 1em;
        bottom: 1em;
    }
    
</style>