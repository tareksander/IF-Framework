<script lang="ts">
    import { globals, rollEvent, goTo } from "../globals";
    import { slide, fade } from "svelte/transition";
    import { onDestroy } from "svelte";
    import { get, writable } from "svelte/store";
    import { engine } from "@if-framework/framework/choice";
    import Event from "../event.svelte";
    import Aft from "./aft.svelte";
    
    let g = globals();
    let found: boolean|undefined = undefined;
    let token: any|undefined = undefined;
    
    let breaches = g.breachesMid;
    let scrap = g.scrap;
    
    let l: any = engine.locals;
    
    let event = writable(l.event ?? null);
    
    function search() {
        found = undefined;
        if (! token) {
            token = setTimeout(() => {
                found = g.rng.nextBool();
                event.set(rollEvent());
                if (found) {
                    scrap.set(get(scrap)+1);
                    engine.saveSession();
                }
                token = undefined;
            }, 2000);
            event.set(null);
        }
    }
    
    onDestroy(() => {
        if (token) {
            clearTimeout(token);
        }
    })
    
    function repairBreach() {
        if (get(scrap) >= 1) {
            scrap.set(get(scrap) - 1);
            breaches.set(get(breaches) - 1);
            event.set(rollEvent());
        }
    }
</script>

<p>
    You are in the ship's midsection.<br>
    Here is your workbench and your tools, as well as the piles of sorted and unsorted scrap you have.<br>
    You already used up the most useful parts of the scrap long ago, but a <a on:click={search}>thorough search</a> might still reveal something.
</p>
{#if $breaches > 0}
    <a style="{($scrap < 1) ? 'color: grey;' : ''}" on:click={repairBreach}>Repair a hull breach. (Requires 1 sorted scrap)</a>
{/if}
{#if found === true}
<p transition:slide={{axis: "y", duration: 500}}>
    You found some useful bits.
</p>
{/if}
{#if found === false}
<p transition:slide={{axis: "y", duration: 500}}>
    You found nothing useful.
</p>
{/if}

<Event event={event}/>

<br><br><br>
{#if ! token}
<div in:fade={{duration: 200}} out:fade={{duration: 200}}>
    <a on:click={() => goTo("front")}>Got to the front</a><br>
    <a on:click={() => goTo("aft")}>Got to the aft</a>
</div>
{/if}


<style>
    
</style>