<script lang="ts">
    import { globals, rollEvent, goTo } from "../globals";
    import { slide, fade } from "svelte/transition";
    import { onDestroy } from "svelte";
    import { get, writable } from "svelte/store";
    import { engine } from "@if-framework/framework/choice";
    import Event from "../event.svelte";
    
    let l: any = engine.locals;
    
    let event = writable(l.event ?? null);
    
    let g = globals();
    let breaches = g.breachesAft;
    
    let scrap = g.scrap;
    let eng = g.enginesOffline;
    
    function repairEngines() {
        if (get(scrap) >= 2) {
            scrap.set(get(scrap) - 2);
            eng.set(false);
            event.set(rollEvent());
        }
    }
    
    function repairBreach() {
        if (get(scrap) >= 1) {
            scrap.set(get(scrap) - 1);
            breaches.set(get(breaches) - 1);
            event.set(rollEvent());
        }
    }
    
</script>

The aft, where your engines and your generator are located.<br>
Normally you also use this room as an additional storage for scrap, but you only have the scrap in the midsection left now.
<br>
{#if $eng}
    <a style="{($scrap < 2) ? 'color: grey;' : ''}" on:click={repairEngines}>Repair the engines. (Requires 2 sorted scrap)</a>
{/if}

<br>
{#if $breaches > 0}
    <a style="{($scrap < 1) ? 'color: grey;' : ''}" on:click={repairBreach}>Repair a hull breach. (Requires 1 sorted scrap)</a>
{/if}
<br>
<Event event={event}/>
<br><br><br>
<div in:fade={{duration: 200}} out:fade={{duration: 200}}>
    <a on:click={() => goTo("midsection")}>Got to the midsection</a><br>
</div>

<style>
    
</style>