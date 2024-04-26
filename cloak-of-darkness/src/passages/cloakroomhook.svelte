<script lang="ts">
    import { Link } from "@if-framework/framework/choice";
    import { globals, room } from "../globals";
    
    let g = globals();
    room("Cloakroom");
    
    function take() {
        g.hasCloak = true;
    }
    
    function hang() {
        g.hasCloak = false;
    }
</script>

<p>
    It's just a small brass hook, screwed to the wall.
</p>
{#if g.hasCloak}
    <p>
        You could <a on:click={hang}>hang</a> your <iff-link passage="cloak">Cloak</iff-link> here.
    </p>
{:else}
    <p>
        You could <a on:click={take}>pick up your cloak and wear it</a>, if you like,
        or simply turn back to the <iff-link passage="cloakroom">Cloakroom</iff-link>.
    </p>
{/if}

<style lang="css">
    a {
        color: var(--link-color);
    }
</style>