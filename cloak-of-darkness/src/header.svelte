<script lang="ts">
    import { engine } from "@if-framework/framework/choice";
    import { globals } from "./globals";
    import { onMount } from "svelte";
    
    onMount(() => {
        let reset = () => {
            room = globals().room;
        };
        engine.onReset.push(reset);
        return () => {
            engine.onReset = engine.onReset.filter((v) => v != reset);
        };
    });
    
    let room = globals().room;
</script>

{#if $room !== ""}
<div class="container">
    <span>
        {$room}
    </span>
</div>
{/if}

<style>
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 2em;
        box-sizing: border-box;
        border-bottom: 1px solid var(--ui-primary-color);
    }
</style>