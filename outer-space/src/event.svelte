<script lang="ts">
    import { Writable, Readable, writable, get, derived } from "svelte/store";
    import { fade, slide } from "svelte/transition";
    import { rollEvent } from "./globals";
    
    export let event: Readable<ReturnType<typeof rollEvent>>;
    
    function breachLocation(): string {
        switch (get(event)) {
            case "meteorAft":
                return "aft";
            case "meteorFront":
                return "front";
            case "meteorMid":
                return "midsection";
        }
        return "";
    }
    
</script>

{#if $event !== null}
    {#if $event == "engines"}
    <div in:fade={{duration: 500}} out:fade={{duration: 500}}>
        Suddenly you are slammed against a wall before the ship's computer has time to compensate as the engines fizzle out.<br>
        Broken engines mean you can't evade any asteroids or start an FTL flight, so you should fix them ASAP.
    </div>
    {:else if $event == "nav"}
    <div in:fade={{duration: 500}} out:fade={{duration: 500}}>
        You hear a familiar sequence of beeps from the front of the ship. The navigation computer has broken again.<br>
        A broken navigation computer can't calculate an FTL flight, so you should fix it ASAP.
    </div>
    {:else}
    <div in:fade={{duration: 500}} out:fade={{duration: 500}}>
        You hear a load bang and sizzling as air escapes through a hull breach in the {breachLocation()}.
    </div>
    {/if}
{/if}

<style>
    
</style>