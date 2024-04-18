<script lang="ts">
    import { globals } from "./globals";
    
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