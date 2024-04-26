<script lang="ts">
    import { engine } from "@if-framework/framework/choice";
    import { globals, hull } from "./globals";
    import { fade, slide } from "svelte/transition";
    
    let g = globals();
    
    let progress = g.progress;
    
    let bf = g.breachesFront;
    let bm = g.breachesMid;
    let ba = g.breachesAft;
    
    let fuel = g.fuel;
    let scrap = g.scrap;
    
    let nav = g.navOffline;
    let eng = g.enginesOffline;
    
    let cp = engine.currentPassage;
</script>

{#if $cp.name != "start" && $cp.name != "intro" && ! $cp.name.includes("ftl")}
<div class="container" in:slide={{axis: "y"}} out:fade={{duration: 200}}>
    <div>
        <span style="margin-right: 2em;">Hull integrity: {$hull}%</span>
        <span>FTL calculation: {$progress}%</span>
    </div>
    <div>
        <span style="margin-right: 2em;">Fuel: {$fuel}%</span>
        <span>Sorted scrap: {$scrap} Handfuls</span>
    </div>
    {#if $bf > 0}
        <div class="red" transition:slide={{axis: "y"}}>Hull breaches in the front: {$bf}</div>
    {/if}
    {#if $bm > 0}
        <div class="red" transition:slide={{axis: "y"}}>Hull breaches in the midsection: {$bm}</div>
    {/if}
    {#if $ba > 0}
        <div class="red" transition:slide={{axis: "y"}}>Hull breaches in the aft: {$ba}</div>
    {/if}
    {#if $nav}
        <div class="red" transition:slide={{axis: "y"}}>Navigation computer offline</div>
    {/if}
    {#if $eng}
        <div class="red" transition:slide={{axis: "y"}}>Engines offline</div>
    {/if}
</div>
{/if}

<style>
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        row-gap: 0.25em;
        width: 100%;
        padding: 2em;
        border-bottom: 1px solid var(--ui-primary-color);
    }
    
    @keyframes warning {
        from {
            color: rgb(255, 100, 100);
        }
        to {
            color: rgb(240, 45, 45);
        }
    }
    
    .red {
        animation: 1s linear infinite alternate warning;
        color: rgb(255, 100, 100);
    }
    
    
    
    
</style>