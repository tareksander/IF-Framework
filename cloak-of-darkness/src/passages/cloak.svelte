<script lang="ts">
    import { History, engine } from "@if-framework/framework/choice";
    import { room } from "../globals";
    import { get } from "svelte/store";
    
    
    room("Cloak");
    
    function back() {
        engine.history.set(new History(get(engine.history).moments.slice(1), 0));
    }
</script>

<p>
    A handsome cloak, of velvet trimmed with satin, and slightly spattered with raindrops.
    Its blackness is so deep that it almost seems to suck light from the room.
</p>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-missing-content -->
<!-- svelte-ignore a11y-missing-attribute -->
<a on:click={back}>Back</a>

<style lang="css">
    a {
        color: var(--link-color);
    }
</style>