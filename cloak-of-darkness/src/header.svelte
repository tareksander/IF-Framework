<script lang="ts">
    import { globals } from "./globals";
    
    // Get the room from the global story variables.
    let room = globals().room;
</script>

<!-- If the room isn't empty... -->
{#if $room !== ""}
<div class="container">
    <span><!-- ...display the room -->
        {$room}
    </span>
</div>
{/if}

<style>
    /* Some simple CSS to center the text and give the header a border along the bottom */
    .container {
        /* Center the text */
        display: flex;
        align-items: center;
        justify-content: center;
        /* Setting the width to 100% is needed os the border is the whole page width */
        width: 100%;
        /* Some padding in case the window is small, so that there is enough distance between the border and the text */
        padding: 2em;
        /* Set a solid 1 pixel border at the bottom in teh normal UI color. */
        border-bottom: 1px solid var(--ui-primary-color);
    }
</style>