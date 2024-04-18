<script lang="ts">
    import { fade } from "svelte/transition";
    import { engine } from "../engine";
    import { updater } from "../../common/update";
    import Update from "./update.svelte";
    import Sidebar, { userSavable } from "./sidebar.svelte";
    import { get } from "svelte/store";
    
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
                // TODO pop up the save export dialog
            }
        }
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

<style lang="css">
    
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
        z-index: 1;
        position: absolute;
        right: 1em;
        bottom: 1em;
    }
    
</style>