<svelte:options customElement={{
    tag: "iff-update",
    shadow: "none",
}} />
<script lang="ts">
    import { fade } from "svelte/transition";
    
    // @ts-ignore
    let upd = window.updater.updateAvailable;
</script>

{#if $upd}
    <div class="update iff-update" in:fade={{duration: 500}}>
        <div class="container iff-container">
            Update available: reload the page to apply
        </div>
    </div>
{/if}

<style lang="css">
    .container {
        border-radius: 10px;
        background-color: rgb(151, 148, 101);
        padding: 0.5em;
    }
    
    .update {
        z-index: 100;
        position: absolute;
        right: 1em;
        bottom: 1em;
    }
</style>