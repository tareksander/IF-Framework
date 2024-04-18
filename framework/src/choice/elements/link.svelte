<script lang="ts">
    import { engine } from "../engine";
    export let passage:string;
    
    let click = (e: Event) => {
        engine.goTo(engine.passage(passage)!);
    };
    
    let href = () => {
        let u = new URL(window.location.toString());
        u.hash = passage;
        return u.toString();
    };
</script>

<a on:click={click} href="{href()}">
    <slot style="color: inherit"></slot>
</a>

<style lang="css">
    a {
        color: var(--link-color);
    }
    
    a:visited {
        color: var(--link-visited-color);
    }
    
</style>