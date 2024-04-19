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
    import Sidebar from "./sidebar.svelte";
    import { Writable, get, writable } from "svelte/store";
    import SaveDialog from "./saveDialog.svelte";
    import { Dialog } from "./dialog";
    import { onMount } from "svelte";
    import { config } from "../config";
    
    /**
     * Optional array of Svelte component constructors to include in the sidebar.
     */
    export let sidebarComponents: any[] = [];
    /**
     * Optional Svelte component constructor to include above the passage content.
     */
    export let header: any|undefined;
    /**
     * Optional Svelte component constructor to include beneath the passage content.
     */
    export let footer: any|undefined;
    /**
     * Controls the length of the passage content transition in milliseconds.
     * 0 disables the transition.
     * This transition should be coordinated with header and footer information components.
     */
    export let transitionDuration: number = 200;
    
    const currentPassage = engine.currentPassage;
    const upd = updater.updateAvailable;
    const loading = engine.loading;
    const passageClass = writable("passage-visible");
    const displayedPassage = writable(get(currentPassage));
    
    function keyDown(e: KeyboardEvent) {
        if (e.ctrlKey && e.key.toLowerCase() == "s") {
            e.preventDefault();
            if (get(config.userSavable)) {
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
    
    //engine.loading.set(true);
    
    function dismissDialog() {
        overlays.set([...(get(overlays).slice(0, -1))]);
    }
    if (transitionDuration != 0) {
        onMount(() => {
            return currentPassage.subscribe(() => {
                if (get(passageClass) === "passage-visible") {
                    passageClass.set("passage-invisible");
                    setTimeout(() => {
                        displayedPassage.set(get(currentPassage));
                        passageClass.set("passage-visible");
                    }, transitionDuration);
                }
            });
        });
    }
    
    let spinner1: HTMLElement;
    let spinner2: HTMLElement;
    let spinner3: HTMLElement;
    
    onMount(() => {
        let token: number|null = null;
        let lastframe: number|null = null;
        let progress = 0;
        let callback: FrameRequestCallback;
        callback = (t) => {
            function rotate([x, y]: [number, number], a: number) {
                let nx =  x * Math.cos(a) - y * Math.sin(a);
                let ny = x * Math.sin(a) + y * Math.cos(a);
                return [nx, ny];
            }
            function rotateElement(p: [number, number], a: number, e: HTMLElement) {
                let [nx, ny] = rotate(p, a);
                e.style.cssText = `top: calc(50vh + ${ny}px); left: calc(50vw + ${nx}px);`;
            }
            function deg2rad(d: number) {
                return d * Math.PI / 180;
            }
            if (lastframe != null) {
                let delta = t - lastframe;
                progress += delta / 10;
                progress %= 100;
                let a;
                if (progress < 50) {
                    a = progress / 50 * deg2rad(120);
                } else {
                    a = deg2rad(120);
                }
                rotateElement([0, -50], a, spinner1);
                rotateElement([0, -50], a + deg2rad(120), spinner2);
                rotateElement([0, -50], a + deg2rad(240), spinner3);
            }
            lastframe = t;
            token = requestAnimationFrame(callback);
        };
        return loading.subscribe((l) => {
            if (l) {
                token = requestAnimationFrame(callback);
            } else {
                if (token != null) {
                    cancelAnimationFrame(token);
                    token = null;
                    lastframe = null;
                    progress = 0;
                }
            }
        });
    })
    
    
    let passageHeight: number;
    let sidebarHeight: number;
    let sidebar: HTMLElement;
    let scrollY: number;
    
    $: if (sidebar != undefined && passageHeight > sidebarHeight) sidebar.style.height = passageHeight + "px";
    $: if (sidebar != undefined && sidebarHeight > passageHeight && sidebarHeight > window.innerHeight) sidebar.style.height = "100%";
</script>

<svelte:window on:keydown={keyDown} bind:scrollY={scrollY}/>

<div class="content" style="width: 100%; align-items: center; justify-content: center; { $loading ? "display: flex;" : "display: none;"}">
    <div bind:this={spinner1} class="spinner" aria-label="Loading spinner"></div>
    <div bind:this={spinner2} class="spinner"></div>
    <div bind:this={spinner3} class="spinner"></div>
</div>
{#if ! $loading}
    <div class="content">
        <div style="flex: 1;" bind:this={sidebar} bind:offsetHeight={sidebarHeight}>
            <Sidebar components={sidebarComponents}/>
        </div>
        <div class="main" bind:offsetHeight={passageHeight}>
            {#if header}
                <svelte:component this={header}/>
            {/if}
            {#if transitionDuration == 0}
            <div class="passage">
                <svelte:component this={$currentPassage.component}/>
            </div>
            {:else}
            <div style="transition: opacity {transitionDuration}ms;" class="passage {$passageClass}">
                <svelte:component this={$displayedPassage.component}/>
            </div>
            {/if}
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
        <div class="overlayBackground" style="top: {scrollY}px" on:click|self={dismissDialog} transition:fade|global={{duration: 100}}>
            <div class="overlayContainer">
                <svelte:component this={o.component}/>
            </div>
        </div>
    {/each}
{/if}

<style lang="css">
    
    
    .spinner {
        position: absolute;
        clip-path: circle(1vh);
        width: 10vh;
        height: 10vh;
        background-color: var(--text-color);
    }
    
    .overlayContainer {
        background-color: var(--ui-secondary-color);
        border-radius: 20px;
        padding: 1em;
        overflow-y: auto;
        max-width: 90vw;
        max-height: 90vh;
    }
    
    .overlayBackground {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        position: absolute;
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
    
    .passage-visible {
        opacity: 1;
    }
    
    .passage-invisible {
        opacity: 0;
    }
    
    .main {
        flex: 5;
        display: flex;
        flex-direction: column;
        height: fit-content;
    }
    
    
    .update {
        z-index: 100;
        position: absolute;
        right: 1em;
        bottom: 1em;
    }
    
</style>