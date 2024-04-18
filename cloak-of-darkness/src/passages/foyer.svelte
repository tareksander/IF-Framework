<script lang="ts" context="module">
    export const meta = {};
    export const tags = [];
</script>
<script lang="ts">
    import { Link } from "@if-framework/framework/choice";
    import { globals, room } from "../globals";
    
    let g = globals();
    
    room("Foyer");
</script>

{#if g.lastRoom == "Outside" && g.hasCloak}
    <p>
        Shaking the rain from your <Link passage="cloak">cloak</Link>, you step gratefully inside.
    </p>
{/if}
<p>
    You are standing in a spacious hall, splendidly decorated in red and gold, with glittering chandeliers overhead.
    The entrance from the street is to the <iff-link passage="outside">north</iff-link>, and there are doorways <iff-link passage="bar">south</iff-link> and <iff-link passage="cloakroom">west</iff-link>.
</p>

<style lang="css">
    
</style>