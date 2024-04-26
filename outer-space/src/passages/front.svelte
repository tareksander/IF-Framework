<script lang="ts">
    import { globals, rollEvent, goTo } from "../globals";
    import { slide, fade } from "svelte/transition";
    import { onDestroy } from "svelte";
    import { get, writable, derived } from "svelte/store";
    import { engine } from "@if-framework/framework/choice";
    import Event from "../event.svelte";
    
    let l: any = engine.locals;
    
    let event = writable(l.event ?? null);
    
    let g = globals();
    let scrap = g.scrap;
    let nav = g.navOffline;
    let eng = g.enginesOffline;
    let breaches = g.breachesFront;
    
    function repairNavigation() {
        if (get(scrap) >= 2) {
            scrap.set(get(scrap) - 2);
            nav.set(false);
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
    
    let meteors = derived([g.meteorFrequency], (f) => {
        if (get(g.meteorFrequency) <= 0.051) {
            return "You see practically not meteorites outside, even on your scanner.";
        }
        if (get(g.meteorFrequency) < 0.21) {
            return "You see some meteorites outside";
        }
        if (get(g.meteorFrequency) >= 0.26) {
            return "You see many meteorites outside. It's probably wise to steer the ship yourself for now.";
        }
        if (get(g.meteorFrequency) >= 0.21) {
            return "You see quite a few meteorites outside.";
        }
    });
    
</script>

The front of your ship, where your pilot seat, computers, scanner and the window of molecularly reinforced glass are.<br>
You can steer the ship manually to reduce the change of running into meteorites, your navigation computer only has a limited autopilot when it's computing and FTL flight.

<br>
<p>
    {$meteors}
</p>
<br>
{#if $nav}
    <a transition:fade={{duration: 200}} style="{($scrap < 2) ? 'color: grey;' : ''}" on:click={repairNavigation}>Repair the navigation computer. (Requires 2 sorted scrap)</a>
{/if}
<br>
{#if ! $eng}
    <a transition:fade={{duration: 200}} on:click={() => event.set(rollEvent())}>Steer the ship manually.</a>
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