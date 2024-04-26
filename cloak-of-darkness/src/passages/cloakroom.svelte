<script lang="ts">
    import { Link } from "@if-framework/framework/choice";
    import { globals, room } from "../globals";
    
    let g = globals();
    room("Cloakroom");
</script>

<p>
    The walls of this small room were clearly once lined with hooks,
    though now <iff-link passage="cloakroomhook">only one remains</iff-link>.
</p>
{#if ! g.hasCloak}
    <p>
        It holds your <iff-link passage="cloak">Cloak</iff-link>.
    </p>
{/if}
<p>
    The exit is a door to the <iff-link passage="foyer">east</iff-link>.
</p>

<style lang="css">
    
</style>