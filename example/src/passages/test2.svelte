<script lang="ts" context="module">
    export const meta = {};
    export const tags = [];
</script>
<script lang="ts">
    import { Link, engine } from "@if-framework/framework/choice";
    
    // Define the interface for the passages local variables...
    interface Locals {
        bool: boolean,
    };
    /// ...and cast the local variable object to it to make Typescript happy.
    let locals = engine.locals as Locals;
    
    // You can use a reactive statement to force a save when a variable changes.
    $: if (locals) engine.saveSession();
    
    /// ??= initializes a variable if it wasn't set.
    locals.bool ??= false;
    
    function click() {
        locals.bool = ! locals.bool;
    }
    
</script>

<div>
<!-- Markdown sections can be embedded into components -->
<iff-markdown>
# Conditions

Click to toggle ***truth***:

</iff-markdown>
    
    <button on:click={click}>
    {#if locals.bool}
        Truth
    {:else}
        Lies
    {/if}
    </button>
    <br><br>
    <Link passage="test3">Continue</Link>
</div>

<style lang="css">
    
</style>