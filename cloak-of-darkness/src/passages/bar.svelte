<script lang="ts">
    import { Link, engine } from "@if-framework/framework/choice";
    import { globals, room } from "../globals";
    
    /**
     * "Darkness index": Which stage of tripping around in the dark you are.
     */
    let di = 0;
    
    let g = globals();
    // The room description is different if you have the cloak on vs off.
    if (g.hasCloak) {
        room("Darkness");
    } else {
        room("Bar");
    }
    
    /**
     * Proceeds to the next stage of "tripping around in the dark".
     */
    function nextD() {
        di += 1;
    }
    
    /**
     * Returns to the foyer.
     */
    function foyer() {
        engine.goTo(engine.passage("foyer")!);
    }
</script>

{#if g.hasCloak}
    <p><!-- List the displayed text for the different `di`'s' -->
        {#if di == 0}
            You can't see a thing! Not even the door you entered by--was it <a on:click={foyer}>north</a>,
            <a on:click={nextD}>south</a>, <a on:click={nextD}>east</a> or <a on:click={nextD}>west</a>?
        {/if}
        {#if di == 1}
            Blundering around in the dark isn't a good idea!
            You can't tell <a on:click={nextD}>left</a> from <a on:click={nextD}>right</a>,
            let alone <a on:click={nextD}>east</a> from <a on:click={nextD}>west</a> or <a on:click={foyer}>north</a> from <a on:click={nextD}>south</a>.
        {/if}
        {#if di == 2}
            No, this isn't getting you anywhere... Let's see, the door was <a on:click={nextD}>south</a>, wasn't it?
            So the exit must be <a on:click={foyer}>north</a>, unless you've gotten <a on:click={nextD}>turned around</a>.
        {/if}
        {#if di == 3}
            Oops, this is just a blank wall! But perhaps if you <a on:click={foyer}>follow it around</a>...
        {/if}
    </p>
{:else}
    <p>
        The bar, much rougher than you'd have guessed after the opulence of the foyer to the north, is completely empty.
        There seems to be some sort of <iff-link passage="message">message</iff-link> scrawled in the sawdust on the floor.
    </p>
{/if}

<style lang="css">
</style>