<script lang="ts">
    import { engine, History, Moment } from "@if-framework/framework/choice";
    import { globals } from "./globals";

    function click() {
        let g = globals();
        g.room.set("");
        g.lastRoom = "";
        g.hasCloak = true;
        engine.history.set(new History([new Moment("start", {})], 0));
    }
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<a on:click={click}>Restart</a>


<style>
    a {
        display: block;
        border: 1px solid var(--ui-primary-color);
        border-right: 0px;
        box-sizing: border-box;
        padding: 1em;
    }
</style>