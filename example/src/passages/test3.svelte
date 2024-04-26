<script lang="ts">
    import { Link, engine } from "@if-framework/framework/choice";
    import { globals } from "../globals";
    
    let g = globals();
    
    /// Also works with global variables modified inside the component
    $: if (g) engine.saveSession();
    
</script>

<div>
<iff-markdown>
# Globals

</iff-markdown>
    
    <input bind:value={g.value}>
    <p>
        Value: {g.value}
    </p>
    
</div>

<style lang="css">
    
</style>